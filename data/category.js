const categoryData = require("./categories.json").verticals
const prisma = require("../src/config/prismaClient")

async function main(){
    for(let data of categoryData){
        const categories = data.categories
        const idMapping = new Map()
        for(let category of categories){
            const categoryToInsert = {
                name: category.name,
                parentId: idMapping.get(category.parent_id)
            }

            const createdCategory = await prisma.categories.create({
                data: categoryToInsert
            })

            idMapping.set(category.id, createdCategory.id)
        }
    }
}

main()