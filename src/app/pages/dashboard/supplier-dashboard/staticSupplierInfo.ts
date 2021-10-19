export const supplierWidgetData = [
    {
        dashboardName: "Supplier_Analysis",
        description: "dri",
        displayOrder: 1,
        id: 1001,
        isVisible: true,
        isInfoBox: true,
        name: "dri",
        widgetBody: {
            text: {
                dri: 0.79
            }
        },
        widgetHeader: {
            filters: [{
                filtername: "information",
            }],
            title: 'DRI'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "reliability",
        displayOrder: 2,
        id: 1002,
        isVisible: true,
        isInfoBox: true,
        name: "reliability",
        widgetBody: {
            chart: {
                type: "solidgauge",
                data: 91
            }
        },
        widgetHeader: {
            filters: [{
                filtername: "information",
            }],
            title: 'Reliability'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "responsiveness",
        displayOrder: 3,
        id: 1003,
        isVisible: true,
        isInfoBox: true,
        name: "responsiveness",
        widgetBody: {
            chart: {
                type: "solidgauge",
                data: 75
            }
        },
        widgetHeader: {
            filters: [{
                filtername: "information",
            }],
            title: 'Responsiveness'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "agility",
        displayOrder: 4,
        id: 1004,
        isVisible: true,
        isInfoBox: true,
        name: "agility",
        widgetBody: {
            chart: {
                type: "solidgauge",
                data: 70
            }
        },
        widgetHeader: {
            filters: [{
                filtername: "information",
            }],
            title: 'Agility'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "agility",
        displayOrder: 5,
        id: 1005,
        isVisible: true,
        isInfoBox: true,
        name: "agility",
        widgetBody: {
            icon: {
                transportRisk: 0.7,
                weatherRisk: 0.4,
                lifeRisk: 0.8,
                moneyRisk: 0.2,
                locationRisk: 0.9,
                documentRisk: 0.2,
                totalRisk: 0.4
            }
        },
        widgetHeader: {
            filters: null,
            title: 'Agility'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "spend on order by buyer",
        displayOrder: 6,
        id: 1006,
        isVisible: true,
        isInfoBox: false,
        name: "spendOnOrderByBuyer",
        widgetBody: {
            chart: {
                type: "donut",
                chartData: {
                    name: 'Brands',
                    colorByPoint: true,
                    data: [{
                        name: 'Marque',
                        y: 55
                    }, {
                        name: 'Simpson',
                        y: 15
                    }, {
                        name: 'Chhabra',
                        y: 14
                    }, {
                        name: 'Brown',
                        y: 9
                    }, {
                        name: 'Rodriques',
                        y: 6
                    }]
                }
            }
        },
        widgetHeader: {
            filters: null,
            title: 'Spend on Order by Buyer'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "quantity on order by buyer",
        displayOrder: 7,
        id: 1007,
        isVisible: true,
        isInfoBox: false,
        name: "quantityOnOrderByBuyer",
        widgetBody: {
            chart: {
                type: "column",
                chartData: {
                    name: 'Buyer',
                    yAxisTitle: 'Order By Quantity',
                    categories: ['Marque', 'Simpson', 'Chhabra', 'Brown', 'Rodriques'],
                    data: [92081, 29468, 65086, 11589, 8258]
                }
            }
        },
        widgetHeader: {
            filters: null,
            title: 'Quantity on Order by Buyer'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "dollars at risk",
        displayOrder: 8,
        id: 1008,
        isVisible: true,
        isInfoBox: false,
        name: "dollarsAtRisk",
        widgetBody: {
            chart: {
                type: "column",
                chartData: {
                    name: 'Buyer',
                    yAxisTitle: 'Order Cost',
                    categories: ['Marque', 'Simpson', 'Chhabra', 'Brown', 'Rodriques'],
                    data: [60654641, 35811424, 14779123, 12364518, 11164112]
                }
            }
        },
        widgetHeader: {
            filters: [{
                filtername: "quantitycost",
                label: ["Quantity", "Dollars"],
                paramname: "",
                selectedValue: "cost",
                type: "Select",
                value: ["quantity", "cost"]
            }],
            title: 'Dollars at Risk'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "orders in next 30 days",
        displayOrder: 9,
        id: 1009,
        isVisible: true,
        isInfoBox: false,
        name: "ordersInNext30Days",
        widgetBody: {
            table: {
                displayCol: [
                    {
                        className: "chkBoxClass",
                        data: "id",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "",
                        visibility: "visible",
                    },
                    {
                        className: "orderClass",
                        data: "orders",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Orders",
                        visibility: "visible",
                    },
                    {
                        className: "qtyClass",
                        data: "quantity",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Qty",
                        visibility: "visible",
                    },
                    {
                        className: "costClass",
                        data: "cost",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Cost($)",
                        visibility: "visible",
                    }
                ],
                data: [
                    {
                        id: 1,
                        orders: 'P000138322',
                        quantity: 45,
                        cost: '900'
                    },
                    {
                        id: 2,
                        orders: 'P000138345',
                        quantity: 32,
                        cost: '450'
                    },
                    {
                        id: 3,
                        orders: 'P000135392',
                        quantity: 109,
                        cost: '1200'
                    },
                    {
                        id: 4,
                        orders: 'P000138621',
                        quantity: 55,
                        cost: '670'
                    },
                    {
                        id: 5,
                        orders: 'P000138801',
                        quantity: 110,
                        cost: '1590'
                    }
                ]
            }
        },
        widgetHeader: {
            filters: null,
            title: 'Orders in next 30 days'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "Items at Risk on time",
        displayOrder: 10,
        id: 1010,
        isVisible: true,
        isInfoBox: false,
        name: "itemsAtRiskOnTime",
        widgetBody: {
            table: {
                displayCol: [
                    {
                        className: "itemClass",
                        data: "items",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Items",
                        visibility: "visible",
                    },
                    {
                        className: "qtyClass",
                        data: "quantity",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Qty",
                        visibility: "visible",
                    },
                    {
                        className: "costClass",
                        data: "cost",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Cost($)",
                        visibility: "visible",
                    },
                    {
                        className: "recClass",
                        data: "rec",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "REC",
                        visibility: "visible",
                    }
                ],
                data: [
                    {
                        items: 'ACTUATORS / PMA10006',
                        quantity: 5,
                        cost: 240,
                        rec: false
                    },
                    {
                        items: 'VALVES / PMA10059',
                        quantity: 10,
                        cost: 400,
                        rec: false
                    },
                    {
                        items: 'MECH_SUB_COMP / PMA26884',
                        quantity: 18,
                        cost: 890,
                        rec: true
                    },
                    {
                        items: 'CONTROLS / PMA73932',
                        quantity: 15,
                        cost: 560,
                        rec: false
                    },
                    {
                        items: 'STARTERS / PMA73944',
                        quantity: 20,
                        cost: 700,
                        rec: false
                    }
                ]
            }
        },
        widgetHeader: {
            filters: null,
            title: 'Items at Risk on time'
        }
    },
    {
        dashboardName: "Supplier_Analysis",
        description: "Items Delivered on time",
        displayOrder: 11,
        id: 1011,
        isVisible: true,
        isInfoBox: false,
        name: "itemsDeliveredOnTime",
        widgetBody: {
            table: {
                displayCol: [
                    {
                        className: "itemClass",
                        data: "items",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Items",
                        visibility: "visible",
                    },
                    {
                        className: "qtyClass",
                        data: "quantity",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Qty",
                        visibility: "visible",
                    },
                    {
                        className: "costClass",
                        data: "cost",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Cost($)",
                        visibility: "visible",
                    }
                ],
                data: [
                    {
                        items: 'MID FORWARD FUSELAGE / PMA10006',
                        quantity: 1,
                        cost: 1200
                    },
                    {
                        items: 'HORIZONTAL STABILISER / PMA73944',
                        quantity: 4,
                        cost: 700
                    },
                    {
                        items: 'TAIL FIN / PMA16521',
                        quantity: 2,
                        cost: 550
                    },
                    {
                        items: 'NACELLES / PMA19371',
                        quantity: 32,
                        cost: 2000
                    },
                    {
                        items: 'CENTER WING BOX / PMA20129',
                        quantity: 4,
                        cost: 780
                    }
                ]
            }
        },
        widgetHeader: {
            filters: null,
            title: 'Items at Risk on time'
        }
    }
];