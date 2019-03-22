const project = (entity) => {
    let projection = {};
    for(let prop in entity) if (entity[prop]) projection[prop] = entity[prop];
    return projection;
}

class BatchRequestBuilder {
    constructor() {
        this.Items = {};
    }

    AddItems(table, items, op) {
        this.Items[table] = this.Items[table] || { add: [], remove: [] };
        this.Items[table][op === "remove" ? "remove" : "add"]
            .push(...items.map(project))
    }

    RenderRequest() {
        const request = {};

        for(let table of this.Items) {
            const requests = [];

            for(let add of this.Items[table].add) {
                requests.push({
                    PutRequest: {
                        item: add
                    }
                });
            }

            for(let remove of this.Items[table].remove) {
                requests.push({
                    DeleteRequest: {
                        item: remove
                    }
                });
            }

            request[table] = requests;
        }

        return request;
    }
}

module.exports = BatchRequestBuilder;
