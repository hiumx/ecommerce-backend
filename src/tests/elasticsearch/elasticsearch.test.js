'use strict';

const { getClient, init } = require("../../dbs/init.elasticsearch");
init({
    ELASTICSEARCH_IS_ENABLE: true,
    ELASTICSEARCH_HOSTS: "http://localhost:9200"
});

const esClient = getClient().elasticsearchClient;

const search = async ({ index, type, payload }) => {
    try {
        return await esClient.search({
            index,
            type, 
            body: payload
        });
    } catch (error) {
        console.error(error);
    }
}

const addNewProduct = async ({ index, type, id, payload}) => {
    try {
        return await esClient.index({
            index,
            id,
            type,
            body: payload
        })
    } catch (error) {
        console.error(error);
    }
}

search({
    index: "product_v001",
    type: "product",
    payload: {
        query: {
            match: {
                title: "1234"
            }
        }
    }
}).then(res => {
    console.log("Result: ", res?.body?.hits?.hits);
}).catch(err => {
    console.error(err);
});

// addNewProduct({
//     index: "product_v001",
//     type: "product", 
//     id: "1234",
//     payload: {
//         title: "Product 1234",
//         desc: "Description of product 1234",
//         thumb: "http://thumb.shopdev.com/product/1234"
//     }
// }).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.error(err);
// });