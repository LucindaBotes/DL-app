'use strict';

const { Contract } = require('fabric-contract-api');

const AssetProperties = Object.freeze({
    ORIGIN: 0,
    PROCESSING: 1,
    PACKAGING: 2,
    SHIPMENT: 3,
    CURRENTOWNER: 4,
    TRANSACTIONHISTORY: 5
});

class AssetTransfer extends Contract {
    // InitLedger adds some seed assets to the ledger 
    // -c '{"function":"InitLedger","Args":[]}'
    async InitLedger(ctx) {
        //populate seed assets
        await this.CreateAsset(
            ctx, 
            "00000001", 
            "Micelsoft Coffee Beans", 
            "{\"Farm\":\"Green Valley Farm\",\"OriginLocation\":\"Ethiopia\",\"Certifications\":[\"Organic\",\"Fair Trade\"],\"HarvestDate\": \"2024-04-15\"}",
            "{\"Processor\":\"\",\"ProcessingLocation\":\"\",\"ProcessDate\":\"\",\"ProcessType\":\"\"}",
            "{\"Packager\":\"\",\"PackagingLocation\":\"\",\"PackageDate\":\"\",\"PackageType\":\"\"}",
            "{\"Shipper\":\"\",\"ShipmentID\":\"\",\"Origin\":\"\",\"Destination\":\"\",\"DepartureDate\":\"\",\"ArrivalDate\": \"\",\"Status\":\"\"}",
            "{\"Entity\":\"Green Valley Farm\",\"OwnerLocation\":\"Ethiopia\",\"ReceivedDate\":\"2024-04-15\"}",
            "[]"
        );
        await this.CreateAsset(
            ctx, 
            "00000002", 
            "Arabica Coffee Beans", 
            "{\"Farm\":\"Green Valley Farm\",\"OriginLocation\":\"Ethiopia\",\"Certifications\":[\"Organic\",\"Fair Trade\"],\"HarvestDate\": \"2024-04-15\"}",
            "{\"Processor\":\"\",\"ProcessingLocation\":\"\",\"ProcessDate\":\"\",\"ProcessType\":\"\"}",
            "{\"Packager\":\"\",\"PackagingLocation\":\"\",\"PackageDate\":\"\",\"PackageType\":\"\"}",
            "{\"Shipper\":\"\",\"ShipmentID\":\"\",\"Origin\":\"\",\"Destination\":\"\",\"DepartureDate\":\"\",\"ArrivalDate\": \"\",\"Status\":\"\"}",
            "{\"Entity\":\"Green Valley Farm\",\"OwnerLocation\":\"Ethiopia\",\"ReceivedDate\":\"2024-04-15\"}",
            "[]"
        );
        await this.CreateAsset(
            ctx, 
            "00000003", 
            "Robusta Coffee Beans", 
            "{\"Farm\":\"Green Valley Farm\",\"OriginLocation\":\"Ethiopia\",\"Certifications\":[\"Organic\",\"Fair Trade\"],\"HarvestDate\": \"2024-04-16\"}",
            "{\"Processor\":\"\",\"ProcessingLocation\":\"\",\"ProcessDate\":\"\",\"ProcessType\":\"\"}",
            "{\"Packager\":\"\",\"PackagingLocation\":\"\",\"PackageDate\":\"\",\"PackageType\":\"\"}",
            "{\"Shipper\":\"\",\"ShipmentID\":\"\",\"Origin\":\"\",\"Destination\":\"\",\"DepartureDate\":\"\",\"ArrivalDate\": \"\",\"Status\":\"\"}",
            "{\"Entity\":\"Green Valley Farm\",\"OwnerLocation\":\"Ethiopia\",\"ReceivedDate\":\"2024-04-16\"}",
            "[]"
        );
        await this.CreateAsset(
            ctx, 
            "00000004", 
            "Java Coffee Beans", 
            "{\"Farm\":\"Green Valley Farm\",\"OriginLocation\":\"Ethiopia\",\"Certifications\":[\"Organic\",\"Fair Trade\"],\"HarvestDate\": \"2024-04-10\"}",
            "{\"Processor\":\"\",\"ProcessingLocation\":\"\",\"ProcessDate\":\"\",\"ProcessType\":\"\"}",
            "{\"Packager\":\"\",\"PackagingLocation\":\"\",\"PackageDate\":\"\",\"PackageType\":\"\"}",
            "{\"Shipper\":\"\",\"ShipmentID\":\"\",\"Origin\":\"\",\"Destination\":\"\",\"DepartureDate\":\"\",\"ArrivalDate\": \"\",\"Status\":\"\"}",
            "{\"Entity\":\"Green Valley Farm\",\"OwnerLocation\":\"Ethiopia\",\"ReceivedDate\":\"2024-04-10\"}",
            "[]"
        );
        await this.CreateAsset(
            ctx, 
            "00000005", 
            "Liberica Coffee Beans", 
            "{\"Farm\":\"Green Valley Farm\",\"OriginLocation\":\"Ethiopia\",\"Certifications\":[\"Organic\",\"Fair Trade\"],\"HarvestDate\": \"2024-04-11\"}",
            "{\"Processor\":\"\",\"ProcessingLocation\":\"\",\"ProcessDate\":\"\",\"ProcessType\":\"\"}",
            "{\"Packager\":\"\",\"PackagingLocation\":\"\",\"PackageDate\":\"\",\"PackageType\":\"\"}",
            "{\"Shipper\":\"\",\"ShipmentID\":\"\",\"Origin\":\"\",\"Destination\":\"\",\"DepartureDate\":\"\",\"ArrivalDate\": \"\",\"Status\":\"\"}",
            "{\"Entity\":\"Green Valley Farm\",\"OwnerLocation\":\"Ethiopia\",\"ReceivedDate\":\"2024-04-11\"}",
            "[]"
        );
        await this.CreateAsset(
            ctx, 
            "00000006", 
            "Excelsa Coffee Beans", 
            "{\"Farm\":\"Green Valley Farm\",\"OriginLocation\":\"Ethiopia\",\"Certifications\":[\"Organic\",\"Fair Trade\"],\"HarvestDate\": \"2024-07-23\"}",
            "{\"Processor\":\"\",\"ProcessingLocation\":\"\",\"ProcessDate\":\"\",\"ProcessType\":\"\"}",
            "{\"Packager\":\"\",\"PackagingLocation\":\"\",\"PackageDate\":\"\",\"PackageType\":\"\"}",
            "{\"Shipper\":\"\",\"ShipmentID\":\"\",\"Origin\":\"\",\"Destination\":\"\",\"DepartureDate\":\"\",\"ArrivalDate\": \"\",\"Status\":\"\"}",
            "{\"Entity\":\"Green Valley Farm\",\"OwnerLocation\":\"Ethiopia\",\"ReceivedDate\":\"2024-07-23\"}",
            "[]"
        );
    }

    // CreateAsset issues a new asset to the world state with given details.
    // -c '{"function":"CreateAsset","Args":["00000001","Micelsoft Coffee Beans","{\"Farm\":\"Green Valley Farm\",\"OriginLocation\":\"Ethiopia\",\"Certifications\":[\"Organic\",\"Fair Trade\"],\"HarvestDate\": \"2024-04-15\"}","{\"Processor\":\"\",\"ProcessingLocation\":\"\",\"ProcessDate\":\"\",\"ProcessType\":\"\"}","{\"Packager\":\"\",\"PackagingLocation\":\"\",\"PackageDate\":\"\",\"PackageType\":\"\"}","{\"Shipper\":\"\",\"ShipmentID\":\"\",\"Origin\":\"\",\"Destination\":\"\",\"DepartureDate\":\"\",\"ArrivalDate\": \"\",\"Status\":\"\"}","{\"Entity\":\"Green Valley Farm\",\"OwnerLocation\":\"Ethiopia\",\"ReceivedDate\":\"2024-04-15\"}","[]"]}'
    async CreateAsset(
        ctx, 
        itemID, 
        itemName, 
        origin,
        processing,
        packaging,
        shipment,
        currentOwner,
        transactionHistory
    ) {
        origin = JSON.parse(origin);
        processing = JSON.parse(processing);
        packaging = JSON.parse(packaging);
        shipment = JSON.parse(shipment);
        currentOwner = JSON.parse(currentOwner);
        transactionHistory = JSON.parse(transactionHistory);
        if (
            await this.HasCorrectKeys(origin, AssetProperties.ORIGIN) 
            && await this.HasCorrectKeys(processing, AssetProperties.PROCESSING)
            && await this.HasCorrectKeys(packaging, AssetProperties.PACKAGING)
            && await this.HasCorrectKeys(shipment, AssetProperties.SHIPMENT)
            && await this.HasCorrectKeys(currentOwner, AssetProperties.CURRENTOWNER)
            && await this.HasCorrectKeys(transactionHistory, AssetProperties.TRANSACTIONHISTORY)
        ) {
            const asset = {
                ItemID: itemID,
                ItemName: itemName,
                Origin: origin,
                Processing: processing,
                Packaging: packaging,
                Shipment: shipment,
                CurrentOwner: currentOwner,
                TransactionHistory: transactionHistory,
                DocType: 'asset'
            };
            await ctx.stub.putState(itemID, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.ItemID} initialized`);
            return JSON.stringify(asset);
        }
        else { 
            throw new Error(`Incorrect parameter structure.`);
        }
    }

    // ReadAsset returns the asset stored in the world state with given id.
    // -c '{"Args":["ReadAsset","00000001"]}' | jq
    async ReadAsset(ctx, itemID) {
        const assetJSON = await ctx.stub.getState(itemID); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${itemID} does not exist`);
        }
        return assetJSON.toString();
    }

    // // UpdateAsset updates an existing asset in the world state with provided parameters.
    // -c '{"function":"UpdateAsset","Args":["00000001","New Micelsoft Coffee Beans","{\"Farm\":\"Green Valley Farm\",\"OriginLocation\":\"Ethiopia\",\"Certifications\":[\"Organic\",\"Fair Trade\"],\"HarvestDate\": \"2024-04-15\"}","{\"Processor\":\"\",\"ProcessingLocation\":\"\",\"ProcessDate\":\"\",\"ProcessType\":\"\"}","{\"Packager\":\"\",\"PackagingLocation\":\"\",\"PackageDate\":\"\",\"PackageType\":\"\"}","{\"Shipper\":\"\",\"ShipmentID\":\"\",\"Origin\":\"\",\"Destination\":\"\",\"DepartureDate\":\"\",\"ArrivalDate\": \"\",\"Status\":\"\"}","{\"Entity\":\"Green Valley Farm\",\"OwnerLocation\":\"Ethiopia\",\"ReceivedDate\":\"2024-04-15\"}","[]"]}'
    async UpdateAsset(
        ctx, 
        itemID, 
        itemName, 
        origin,
        processing,
        packaging,
        shipment ,
        currentOwner,
        transactionHistory
    ) {
        const exists = await this.AssetExists(ctx, itemID);
        if (!exists) {
            throw new Error(`The asset ${itemID} does not exist`);
        }

        origin = JSON.parse(origin);
        processing = JSON.parse(processing);
        packaging = JSON.parse(packaging);
        shipment = JSON.parse(shipment);
        currentOwner = JSON.parse(currentOwner);
        transactionHistory = JSON.parse(transactionHistory);
        if (
            await this.HasCorrectKeys(origin, AssetProperties.ORIGIN) 
            && await this.HasCorrectKeys(processing, AssetProperties.PROCESSING)
            && await this.HasCorrectKeys(packaging, AssetProperties.PACKAGING)
            && await this.HasCorrectKeys(shipment, AssetProperties.SHIPMENT)
            && await this.HasCorrectKeys(currentOwner, AssetProperties.CURRENTOWNER)
            && await this.HasCorrectKeys(transactionHistory, AssetProperties.TRANSACTIONHISTORY)
        ) {
            // overwriting original asset with new asset
            const updatedAsset = {
                ItemID: itemID,
                ItemName: itemName,
                Origin: origin,
                Processing: processing,
                Packaging: packaging,
                Shipment: shipment,
                CurrentOwner: currentOwner,
                TransactionHistory: transactionHistory,
            };
            return ctx.stub.putState(itemID, Buffer.from(JSON.stringify(updatedAsset)));
        }
        else { 
            throw new Error(`Incorrect parameter structure.`);
        }
    }

    //Moves asset from its origin to the processor
    // -c '{"function":"ProcessAsset","Args":["00000001","Ethiopian Coffee Processing Ltd.","Addis Ababa, Ethiopia","2024-04-20","Wet Processing","TXN12347"]}'
    async ProcessAsset(
        ctx, 
        itemID, 
        processor,
        processingLocation,
        processDate,
        processType,
        transactionID
    ) {
        const newOwner = JSON.stringify({
            Entity: processor,
            OwnerLocation: processingLocation,
            ReceivedDate: processDate
        });
        const asset = await this.TransferAsset(ctx, itemID, newOwner, transactionID, "Harvested and sent for processing", true);
        asset.Processing = {
            Processor: processor,
            ProcessingLocation: processingLocation,
            ProcessDate: processDate,
            ProcessType: processType
        };
        return ctx.stub.putState(itemID, Buffer.from(JSON.stringify(asset)));
    }

    //Moves asset from its processor to the packager
    // -c '{"function":"PackageAsset","Args":["00000001","Global Coffee Packers Inc.","Nairobi, Kenya","2024-04-25","Eco-friendly Bags","TXN12348"]}'
    async PackageAsset(
        ctx, 
        itemID, 
        packager,
        packagingLocation,
        packageDate,
        packageType,
        transactionID
    ) {
        const newOwner = JSON.stringify({
            Entity: packager,
            OwnerLocation: packagingLocation,
            ReceivedDate: packageDate
        }); 
        const asset = await this.TransferAsset(ctx, itemID, newOwner, transactionID, "Processed and sent for packaging", true);
        asset.Packaging = {
            Packager: packager,
            PackagingLocation: packagingLocation,
            PackageDate: packageDate,
            PackageType: packageType
        };
        return ctx.stub.putState(itemID, Buffer.from(JSON.stringify(asset)));
    }

    //Moves asset from its packager to the shipper
    // -c '{"function":"ShipAsset","Args":["00000001","International Shippers Co.","SHIP987654321","New York, USA","2024-05-01","In Transit","TXN12349"]}'
    async ShipAsset(
        ctx, 
        itemID, 
        shipper,
        shipmentID,
        destination,
        departureDate,
        status,
        transactionID
    ) {
        const newOwner = JSON.stringify({
            Entity: shipper,
            OwnerLocation: shipper,
            ReceivedDate: departureDate
        });
        const asset = await this.TransferAsset(ctx, itemID, newOwner, transactionID, "Packaged and sent for shipment", true);
        asset.Shipment = {
            Shipper: shipper,
            ShipmentID: shipmentID,
            Origin: asset.CurrentOwner.OwnerLocation,
            Destination: destination,
            DepartureDate: departureDate,
            ArrivalDate: "",
            Status: status
        };
        return ctx.stub.putState(itemID, Buffer.from(JSON.stringify(asset)));
    }

    //Moves asset from its shipper to its destination
    // -c '{"function":"CompleteShipment","Args":["00000001","Coffee Distributors USA","2024-05-10","Shipped","TXN12350"]}'
    async CompleteShipment(
        ctx, 
        itemID, 
        recipient,
        arrivalDate,
        status,
        transactionID
    ) {
        const assetString = await this.ReadAsset(ctx, itemID);
        const asset = JSON.parse(assetString);
        const newOwner = JSON.stringify({
            Entity: recipient,
            OwnerLocation: asset.Shipment.Destination,
            ReceivedDate: arrivalDate
        });
        asset = await this.TransferAsset(ctx, itemID, newOwner, transactionID, "Shipped and received", true);
        asset.Shipment.ArrivalDate = arrivalDate;
        asset.Shipment.Status =  status;
        return ctx.stub.putState(itemID, Buffer.from(JSON.stringify(asset)));
    }

    // DeleteAsset deletes an given asset from the world state.
    // -c '{"function":"DeleteAsset","Args":["00000001"]}'
    async DeleteAsset(ctx, itemID) {
        const exists = await this.AssetExists(ctx, itemID);
        if (!exists) {
            throw new Error(`The asset ${itemID} does not exist`);
        }
        return ctx.stub.deleteState(itemID);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    // -c '{"function":"DeleteAsset","Args":["00000001"]}'
    async AssetExists(ctx, itemID) {
        const assetJSON = await ctx.stub.getState(itemID);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    // -c '{"function":"TransferAsset","Args":["00000001","{\"Entity\":\"Coffee Distributors USA\",\"OwnerLocation\":\"New York, USA\",\"ReceivedDate\":\"2024-05-10\"}","TXN12350","Shipped and received"]}'
    async TransferAsset(
        ctx, 
        itemID, 
        newOwner,
        transactionID,
        details,
        returnAsset = false
    ) {
        newOwner = JSON.parse(newOwner);
        if (await this.HasCorrectKeys(newOwner, AssetProperties.CURRENTOWNER)) {
            const assetString = await this.ReadAsset(ctx, itemID);
            const asset = JSON.parse(assetString);
            asset.TransactionHistory.push({
                TransactionID: transactionID,
                Timestamp: "",
                From: asset.CurrentOwner.Entity,
                To: newOwner.Entity,
                Details: details
            });
            asset.CurrentOwner = newOwner;
            if (returnAsset) {
                return asset;
            }
            return ctx.stub.putState(itemID, Buffer.from(JSON.stringify(asset)));
        }
        else { 
            throw new Error(`Incorrect parameter structure.`);
        }

    }

    // GetAllResults returns all the results from an iterator
    async GetAllResults(iterator, isHistory) {
		const allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}

    // GetAllAssets returns all assets found in the world state.
    // -c '{"Args":["GetAllAssets"]}' | jq
    async GetAllAssets(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = await this.GetAllResults(iterator, false);

        return JSON.stringify(allResults);
    }

    // GetAssetHistory returns the chain of custody for an asset since issuance.
    // -c '{"Args":["GetAssetHistory","00000001"]}' | jq
	async GetAssetHistory(ctx, itemID) {
        const exists = await this.AssetExists(ctx, itemID);
        if (!exists) {
            throw new Error(`The asset ${itemID} does not exist`);
        }

		const iterator = await ctx.stub.getHistoryForKey(itemID);
		const results = await this.GetAllResults(iterator, true);

		return JSON.stringify(results);
	}

    // GetQueryResultForQueryString executes the passed in query string.
	async GetQueryResultForQueryString(ctx, queryString) {

		const iterator = await ctx.stub.getQueryResult(queryString);
		const results = await this.GetAllResults(iterator, false);

		return JSON.stringify(results);
	}

    // GetAssetsByOwner returns all assets owned by a specified owner.
    // -c '{"Args":["GetAssetsByOwner","Ethiopian Coffee Processing Ltd."]}' | jq
    async GetAssetsByOwner(ctx, ownerEntity) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.DocType = 'asset';
        queryString.selector.CurrentOwner = {}
		queryString.selector.CurrentOwner.Entity = ownerEntity;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
	}

    async HasCorrectKeys(obj, propertyType) {
        switch(propertyType) {
            case AssetProperties.ORIGIN:
                return (
                    obj.hasOwnProperty("Farm") 
                    && obj.hasOwnProperty("OriginLocation") 
                    && obj.hasOwnProperty("Certifications") 
                    && obj.hasOwnProperty("HarvestDate")
                );
            case AssetProperties.PROCESSING:
                return (
                    obj.hasOwnProperty("Processor") 
                    && obj.hasOwnProperty("ProcessingLocation") 
                    && obj.hasOwnProperty("ProcessDate") 
                    && obj.hasOwnProperty("ProcessType")
                );
            case AssetProperties.PACKAGING:
                return (
                    obj.hasOwnProperty("Packager") 
                    && obj.hasOwnProperty("PackagingLocation") 
                    && obj.hasOwnProperty("PackageDate") 
                    && obj.hasOwnProperty("PackageType")
                );
            case AssetProperties.SHIPMENT:
                return (
                    obj.hasOwnProperty("Shipper") 
                    && obj.hasOwnProperty("ShipmentID") 
                    && obj.hasOwnProperty("Origin") 
                    && obj.hasOwnProperty("Destination") 
                    && obj.hasOwnProperty("DepartureDate") 
                    && obj.hasOwnProperty("ArrivalDate") 
                    && obj.hasOwnProperty("Status")
                );
            case AssetProperties.CURRENTOWNER:
                return (
                    obj.hasOwnProperty("Entity") 
                    && obj.hasOwnProperty("OwnerLocation") 
                    && obj.hasOwnProperty("ReceivedDate") 
                );
            case AssetProperties.TRANSACTIONHISTORY:
                if (!Array.isArray(obj)) {
                    return false;
                }
                return obj.every((item) => 
                    item.hasOwnProperty("TransactionID") 
                    && item.hasOwnProperty("Timestamp") 
                    && item.hasOwnProperty("From") 
                    && item.hasOwnProperty("To") 
                    && item.hasOwnProperty("Details") 
                )
            default:
                return false
        }
    }
}

module.exports = AssetTransfer;
