import express, { response } from "express";
import dotenv from "dotenv";
import webhookRouter from './routes/webhook.mjs'
//DB
import mongoose from "./database.mjs";
import { chatContext } from "./utils/fetchChat.mjs";
import { cacheStoreChat } from "./model/storeChat.mjs";
// import {  cacheStoreChat, fetchChatFromRedis, getChatHistory, redisToMongo } from "./model/storeChat.mjs";
// import { chatContext } from "./utils/fetchChat.mjs";
// import { cache } from "./redis.mjs";

// configurations
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// middlewares
app.use(express.json());

// routes
app.use('/webhook', webhookRouter);

// default endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: `server is up and running at PORT : ${port}` })
});
// server initialization

try {
  if (mongoose.connection.readyState) {
    console.log(`________connection state: ${mongoose.connection.readyState}`);
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }
}
catch (error) {
  console.error('Index error',error);
  process.exit(1);
}

const bulkChat = [
  {
    query: 'kealth problems',
    response: 'I cannot provide specific health advice or diagnoses.  The term "kealth problems" seems to be a misspelling.  Could you please clarify your health concern?  I can offer general information on various health issues once you provide more details.\n'
  },
  {
    query: 'joint pain',
    response: 'Joint pain can be caused by various factors, including injury, arthritis, overuse, or underlying medical conditions.\n' +
      '\n' +
      '* **Symptoms:** Pain, swelling, stiffness, and limited range of motion in the affected joint.\n' +
      '* **Diagnosis:** A doctor will evaluate your symptoms, conduct a physical exam, and may order X-rays or other imaging tests.\n' +
      '* **Treatment:** Treatment depends on the cause and may include rest, ice, compression, elevation (RICE), pain relievers, physical therapy, or surgery.\n' +
      '* **Prevention:** Maintaining a healthy weight, strengthening muscles around the joints, and proper posture can help.\n' +
      '\n' +
      '\n' +
      'For persistent or severe joint pain, consult a doctor.\n' +
      '\n' +
      'https://www.mayoclinic.org/diseases-conditions/joint-pain/symptoms-causes/syc-20350970\n' +
      "(This link leads to Mayo Clinic's"
  },
  {
    query: 'knee pain',
    response: 'Knee pain can stem from various issues, such as injury (sprains, fractures), arthritis (osteoarthritis, rheumatoid arthritis), overuse, or underlying medical conditions.\n' +
      '\n' +
      '* **Symptoms:**  Pain, swelling, stiffness, limited range of motion.\n' +
      '* **Diagnosis:**  A doctor will assess symptoms, conduct a physical exam, and may order X-rays or MRI scans.\n' +
      '* **Treatment:** Treatment depends on the cause and may include rest, ice, compression, elevation (RICE), pain relievers, physical therapy, or surgery.\n' +
      '* **Prevention:** Maintaining a healthy weight, strengthening leg muscles, and using proper footwear can help prevent knee pain.\n' +
      '\n' +
      '\n' +
      'For persistent or severe knee pain, consult a doctor.\n' +
      '\n' +
      'https://www.mayoclinic.org/diseases-conditions/knee-pain/symptoms-causes/syc-20356092\n'
  },
  {
    query: 'gastric',
    response: 'Gastritis is inflammation of the stomach lining.\n' +
      '\n' +
      '* **Causes:** Common causes include infection (e.g., H. pylori bacteria),  long-term use of NSAIDs, alcohol abuse, and autoimmune disorders.\n' +
      '* **Symptoms:** Symptoms may include stomach pain, nausea, vomiting, bloating, and loss of appetite.\n' +
      '* **Treatment:** Treatment depends on the cause and may include medications to reduce stomach acid, antibiotics (if caused by infection), and lifestyle changes.\n' +
      '* **Prevention:**  Avoid excessive alcohol consumption,  use NSAIDs cautiously, and manage stress.\n' +
      '\n' +
      'For persistent or severe symptoms, consult a doctor.\n' +
      '\n' +
      'https://www.niddk.nih.gov/health-information/digestive-diseases/gastritis\n' +
      '(This link leads to the National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK) website with information on gastritis.)\n' +
      '\n' +
      '😊'
  }
]

// await cacheStoreChat(918798068129,bulkChat);   //testing redis store

// const history = await fetchChatFromRedis(918798068129);     //testing redis fetch
// console.log('hsitory\n',history)


// const dbhistory = await getChatHistory(917002134811);        //testing DB fetch
// console.log('dbhist\n',dbhistory.chatHistory);

// const history = await chatContext(918798068129);
// console.log(`History in index file: ${history}`);
// await cache.lPush(`chatHistory:${918798068129}`, bulkChat.map(chat => JSON.stringify(chat)));

// const history_context = await chatContext(917005253152);
// console.log('printing DONKEY',history_context);
// // let parsed_response = JSON.parse(history_context);
// // const formatedContext = parseRedisResponse(history_context)


// // console.log(`\n\n\nchatContext_ ${history_context}`);
// // console.log(typeof(history_context));

// // console.log(`\n\parsed_response ${parsed_response}`);
// // console.log(typeof(parsed_response));

// console.log(`\n\nformatedContext_ ${formatedContext}`);
// console.log(typeof(formatedContext));



/*
const fetchingIndex = await chatContext(919862694100);
console.log(`\n\nIndex print: ${fetchingIndex}`);
fetchingIndex.forEach(el=>{
  console.log(el);
})

let i = Math.floor(Math.random()*100)

let chat = {
  query: i++,
  response: "result.response.text()"
}

let storingIndex = await cacheStoreChat(919862694100,chat);
console.log(`\n\n1234_storingIndex: ${chat.query}`)
*/
                  