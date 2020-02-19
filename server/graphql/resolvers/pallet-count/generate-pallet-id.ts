import { generateId } from '@things-factory/id-rule-base'

export const generatePalletIdResolver = {
  async generatePalletId(_: any, { batchId }, context: any) {

    let today = new Date()
			let year = today.getFullYear()
			let month = today.getMonth()
			let day = today.getDate()

    let date =
			year.toString().substr(year.toString().length - 2) +
			('0' + (month + 1).toString()).substr(('0' + (month + 1).toString()).toString().length - 2) +
			('0' + day.toString()).substr(('0' + day.toString()).length - 2)

		let palletId = await generateId({
			domain: context.state.domain,
			type: 'pallet_id',
			seed: {
				batchId: batchId,
				date: date
			}
		})

    return palletId
  }
}