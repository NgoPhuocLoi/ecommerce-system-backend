const categoryData = require("./categories.json").verticals;
const attributesData = require("./attributes.json").attributes;
const prisma = require("../src/config/prismaClient");
const fs = require("fs");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const attributeIdMapping = require("./attributeIdMapping.json");
  const mapping = new Map();
  attributeIdMapping.forEach((a) => {
    mapping.set(a.id, a.dbId);
  });
  for (let data of categoryData) {
    const categories = data.categories;
    for (let category of categories) {
      // const category = categories[0];
      const categoryInDB = await prisma.categories.findFirst({
        where: {
          name: category.name,
        },
      });
      console.log(`Creating mapping attributes for ${category.name}=====`);
      await prisma.recommendAttributeOfCategory.createMany({
        data: category.attributes.map((attribute) => ({
          recommendAttributeId: mapping.get(attribute.id),
          categoryId: categoryInDB.id,
        })),
      });
      // for (let attribute of category.attributes) {
      //   // console.log(attribute.name);
      //   console.log(attribute.name, mapping.get(attribute.id));
      //   // const values = attributesData.find(
      //   //   (attr) => attr.id === attribute.id
      //   // ).values;

      //   // const savedAttribute = await prisma.recommendAttributes.create({
      //   //   data: {
      //   //     name: attribute.name,
      //   //     categoryId: categoryInDB.id,
      //   //   },
      //   // });
      //   // console.log(`   Attribute ${attribute.name} created`);
      //   // console.log(`   Creating values for ${attribute.name}=====`);

      //   // const result = await prisma.recommendAttributeValues.createMany({
      //   //   data: values.map((value) => ({
      //   //     name: value.name,
      //   //     recommendAttributeId: savedAttribute.id,
      //   //   })),
      //   // });
      //   // console.log(`             Values for ${attribute.name} created`);
      //   // await sleep(200);
      // }
      // console.log(categoryInDB.id);
      //   const categoryToInsert = {
      //     name: category.name,
      //     parentId: idMapping.get(category.parent_id),
      //   };

      //   const createdCategory = await prisma.categories.create({
      //     data: categoryToInsert,
      //   });

      //   idMapping.set(category.id, createdCategory.id);
    }
    // await sleep(1000);
  }
}

// main();

async function saveAttributesAndValues() {
  const attributeIdMapping = [];
  let count = 10;
  for (let attribute of attributesData) {
    const values = attribute.values;
    console.log(`Creating attribute ${attribute.name}=====`);

    const savedAttribute = await prisma.recommendAttributes.create({
      data: {
        name: attribute.name,
      },
    });

    attributeIdMapping.push({ id: attribute.id, dbId: savedAttribute.id });

    console.log(`   Attribute ${attribute.name} created`);
    console.log(`   Creating values for ${attribute.name}=====`);
    const result = await prisma.recommendAttributeValues.createMany({
      data: values.map((value) => ({
        name: value.name,
        recommendAttributeId: savedAttribute.id,
      })),
    });
    console.log(`             Values for ${attribute.name} created`);
  }

  const data = JSON.stringify([...attributeIdMapping]);
  fs.writeFileSync("data/attributeIdMapping.json", data, (error) => {
    if (error) {
      console.log(error);
    }
  });

  console.log("DONE");
}

async function saveAttributeCategoryMapping() {
  console.log(attributeIdMapping.length);
}

// saveAttributesAndValues();
main();
