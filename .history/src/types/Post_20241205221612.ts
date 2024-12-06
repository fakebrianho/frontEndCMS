export interface Post {
	_id?: string
	title: string
	content: string
	prev?: string
	next?: string
	uuid: string
	children?: string
	parent?: string
	isSectionHead: boolean
	createdAt: Date
	updatedAt: Date
}
