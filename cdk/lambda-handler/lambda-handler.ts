import { assetExists } from "../lambdas/assetExists";
import { createAsset } from "../lambdas/createAsset";
import { deleteAsset } from "../lambdas/deleteAsset";
import { getAllAssets } from "../lambdas/getAllAssets";
import { getAllResults } from "../lambdas/getAllResults";
import { getAssetHistory } from "../lambdas/getAssetHistory";
import { getAssetsByOwner } from "../lambdas/getAssetsByOwner";
import { getResultForString } from "../lambdas/getResultForString";
import { initLedger } from "../lambdas/initLedger";
import { readAsset } from "../lambdas/readAsset";
import { transferAsset } from "../lambdas/transferAsset";
import { updateAsset } from "../lambdas/updateAsset";


export const distLedgerHandler = async (event: any) => {
    console.log("Event received:", event);
    
    let response;
    
    try {
        switch (event.action) {
            case "assetExists":
                response = await assetExists(event);
                break;
            case "createAsset":
                response = await createAsset(event);
                break;
            case "deleteAsset":
                response = await deleteAsset(event);
                break;
            case "getAllAssets":
                response = await getAllAssets(event);
                break;
            case "getAllResults":
                response = await getAllResults(event);
                break;
            case "getAssetHistory":
                response = await getAssetHistory(event);
                break;
            case "getAssetsByOwner":
                response = await getAssetsByOwner(event);
                break;
            case "getResultForString":
                response = await getResultForString(event);
                break;
            case "initLedger":
                response = await initLedger(event);
                break;
            case "readAsset":
                response = await readAsset(event);
                break;
            case "transferAsset":
                response = await transferAsset(event);
                break;
            case "updateAsset":
                response = await updateAsset(event);
                break;
            default:
                response = {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Invalid action" })
                };
        }
    } catch (error) {
        console.error("Error processing event:", error);
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        };
    }
    
    return response;
};
