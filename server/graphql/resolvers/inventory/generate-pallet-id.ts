import { getRepository, In } from 'typeorm'
import { generateId } from '@things-factory/id-rule-base'
import { WorksheetDetail } from '@things-factory/worksheet-base'

export const generatePalletIdResolver = {
  async generatePalletId(_: any, { targets }, context: any) {

		// 1. get and set the date
		const today = new Date()
		const year = today.getFullYear()
		const month = today.getMonth()
		const day = today.getDate()

		const date =
			year.toString().substr(year.toString().length - 2) +
			('0' + (month + 1).toString()).substr(('0' + (month + 1).toString()).toString().length - 2) +
			('0' + day.toString()).substr(('0' + day.toString()).length - 2)

		let results = []

		// 2. get worksheet detail
		let ids = targets.map(target => target.id)
		
		// - getRepository using In(array) to pass the value to defined variable
		const foundWorksheetDetails:WorksheetDetail[] = await getRepository(WorksheetDetail).find({
			where: {
				domain: context.state.domain,
				id: In(ids)
			},
			relations: ['domain', 'bizplace', 'worksheet', 'worker', 'targetProduct', 'targetProduct.product']
		})
		
		// 3. from worksheet detail get product name, product type, batchid, packing type, bizplace

		if(foundWorksheetDetails.length <= 0) 
			throw new Error('Unable to find worksheet details')
		else {
			for (let i = 0; i < foundWorksheetDetails.length; i++) {
				let foundWSD = foundWorksheetDetails[i]
				for (let idx = 0; idx < targets.length; idx++) {

					if (foundWSD.id === targets[idx].id) {
						
						// 4. generate pallet id based on print qty > call generateId resolver
						for (let i=0; i<targets[idx].printQty; i++) {
							const generatedPalletId = await generateId({
								domain: context.state.domain,
								type: 'pallet_id',
								seed: {
									batchId: foundWSD.targetProduct.batchId,
									date: date
								}
							})

							// 5. map all data to be returned
							results.push({
								...foundWSD.targetProduct,
								palletId: generatedPalletId,
								bizplace: foundWSD.bizplace
							})
						}
					}			
				}	
			}
		}

    return results
  }
}