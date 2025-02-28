// servicetype map with O(1) lookup time
export const serviceType = {
    "greeting":{
        method: "POST",
        url: "https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/",
        headers: {
          authkey: ``,
          "content-type": "application/json",
          accept: "application/json",
        },
        data: {
          recipient_number: ``,
          integrated_number: ``,
          content_type: "interactive",
          interactive: {
            type: "button",
            header: {
              type: "text",
              text: "Welcome to HospiSuite 🏥",
            },
            body: {
              text: "ldsakfjl;skdfj;lsadkfj;lakdsjf;ldsakfja;ldskjf;dlksfdsf",
            },
            footer: {
              text: "Thank you for using HospiSuite",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "id1",
                    title: " ABHA Services",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "id2",
                    title: "CMHIS Services",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "id3",
                    title: "Online Consultation",
                  },
                },
              ],
            },
          },
        },
      },
    "cmhis services": {
        method: "POST",
        url: "https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/",
        headers: {
          authkey: ``,
          "content-type": "application/json",
          accept: "application/json",
        },
        data: {
          recipient_number: ``,
          integrated_number: ``,
          content_type: "interactive",
          interactive: {
            type: "button",
            header: {
              type: "text",
              text: "List of CMHIS services",
            },
            body: {
              text: "lkfajl;dskfj;ldsakfj;dsalkfj;lsadkfj;lkdsafj;lkdsjf;dsfdsdsfdsfdsf",
            },
            footer: {
              text: "Thank you for using HospiSuite",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "id1",
                    title: " CMHIS Registration",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "id2",
                    title: "Health & Insurance",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "id3",
                    title: "Empaneled Hospitals",
                  },
                },
              ],
            },
          },
        },
      },   
    "abha services": {
        method: "POST",
        url: "https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/",
        headers: {
          authkey: ``,
          "content-type": "application/json",
          accept: "application/json",
        },
        data: {
          recipient_number: ``,
          integrated_number: ``,
          content_type: "interactive",
          interactive: {
            type: "button",
            header: {
              type: "text",
              text: "List of ABHA services",
            },
            body: {
              text: "sdfldsjflkgsjdf;lkgjs;dlfkgj;lkfds jghfdogihpoihter;h;lkfd",
            },
            footer: {
              text: "Thank you for using HospiSuite",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "id1",
                    title: " ABHA Registration",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "id2",
                    title: "Health & Insurance",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "id3",
                    title: "Empaneled Hospitals",
                  },
                },
              ],
            },
          },
        },
      },
  };
