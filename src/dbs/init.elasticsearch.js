'use strict';

const { Client } = require("@elastic/elasticsearch");

const clients = {};

const instanceEventListener = async (elasticsearchClient) => {
    try {
        await elasticsearchClient.ping();
        console.log("Connected to elasticsearch successfully");
    } catch (error) {
        console.error("Connect fail to elasticsearch!", error);
    }
}

const init = ({
    ELASTICSEARCH_IS_ENABLE,
    ELASTICSEARCH_HOSTS = process.env.ELASTICSEARCH_HOSTS
}) => {
    if(ELASTICSEARCH_IS_ENABLE) {
        const elasticsearchClient = new Client({
            node: ELASTICSEARCH_HOSTS
        });
        clients.elasticsearchClient = elasticsearchClient;
        instanceEventListener(elasticsearchClient);
    }
}

const getClient = () => clients;

const closeConnect = () => {

}

module.exports = {
    init,
    getClient,
    closeConnect
}