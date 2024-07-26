#!/bin/bash

function invokeChaincode() {
    docker exec cli peer chaincode invoke \
    --tls --cafile /opt/home/managedblockchain-tls-chain.pem \
    --channelID ws-supplier-channel \
    --name ws-supplier-cc \
    -c $1
}

invokeChaincode "'{"function":"InitLedger","Args":[]}'"

invokeChaincode '{"function":"ProcessAsset","Args":["00000001","Ethiopian Coffee Processing Ltd.","Addis Ababa, Ethiopia","2024-04-20","Wet Processing","TXN00001"]}' 
invokeChaincode '{"function":"ProcessAsset","Args":["00000002","Ethiopian Coffee Processing Ltd.","Addis Ababa, Ethiopia","2024-04-20","Wet Processing","TXN00002"]}'
invokeChaincode '{"function":"ProcessAsset","Args":["00000003","Ethiopian Coffee Processing Ltd.","Addis Ababa, Ethiopia","2024-04-21","Wet Processing","TXN00003"]}'
invokeChaincode '{"function":"ProcessAsset","Args":["00000004","Ethiopian Coffee Processing Ltd.","Addis Ababa, Ethiopia","2024-04-24","Wet Processing","TXN00004"]}'
invokeChaincode '{"function":"ProcessAsset","Args":["00000005","Ethiopian Coffee Processing Ltd.","Addis Ababa, Ethiopia","2024-04-24","Wet Processing","TXN00005"]}'

invokeChaincode '{"function":"PackageAsset","Args":["00000001","Global Coffee Packers Inc.","Nairobi, Kenya","2024-04-25","Eco-friendly Bags","TXN00006"]}'
invokeChaincode '{"function":"PackageAsset","Args":["00000002","Global Coffee Packers Inc.","Nairobi, Kenya","2024-04-25","Eco-friendly Bags","TXN00007"]}'
invokeChaincode '{"function":"PackageAsset","Args":["00000004","Global Coffee Packers Inc.","Nairobi, Kenya","2024-04-26","Plastic Bags","TXN00008"]}'
invokeChaincode '{"function":"PackageAsset","Args":["00000005","Global Coffee Packers Inc.","Nairobi, Kenya","2024-04-26","Plastic Bags","TXN00009"]}'

invokeChaincode '{"function":"ShipAsset","Args":["00000001","International Shippers Co.","SHIP000000301","New York, USA","2024-05-01","In Transit","TXN00010"]}'
invokeChaincode '{"function":"ShipAsset","Args":["00000002","International Shippers Co.","SHIP000000302","New York, USA","2024-05-02","In Transit","TXN00011"]}'
invokeChaincode '{"function":"ShipAsset","Args":["00000004","International Shippers Co.","SHIP000000303","New York, USA","2024-05-05","In Transit","TXN00012"]}'

invokeChaincode '{"function":"CompleteShipment","Args":["00000001","Coffee Distributors USA","2024-05-10","Shipped","TXN00013"]}'
invokeChaincode '{"function":"CompleteShipment","Args":["00000002","Coffee Distributors USA","2024-05-12","Shipped","TXN00014"]}'