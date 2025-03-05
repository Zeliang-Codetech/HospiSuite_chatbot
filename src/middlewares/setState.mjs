const greetings = [
  "Hi",
  "Hello",
  "Hey",
  "Howdy",
  "Greetings",
  "Namaste",
  "Hiya",
  "Yo",
  "What's up",
  "Heya",
  "Aloha",
  "Sup",
  "G'day",
  "good day",
  "Hola",
  "Wassup",
  "Namaskar",
  "Namaskaram",
  "Heylo",
  "Hai",
  "Helloji",
  "Hi, Hospisuite",
  "Good afternoon",
  "good morning",
  "good evening",
  "afternoon",
  "morning",
  "evening",
  "noon",
  "good day",
];

export const setUserState = (req, res, next) => {
  let userMsg = req.user.msg;
  let location = req.user?.location || "";
  console.log(`from setState Middleware : ${userMsg}`);
  console.log("Message type:", req.user.messageType);
  console.log("Interactive type:", req.user.interactiveType);
  let formattedMsg = userMsg.toLowerCase();


     // Handle interactive messages first (buttons/lists)
  if (req.user.messageType === "interactive") {
    req.userMsg = formattedMsg;
    req.query = ""; // No AI query for interactive messages
    console.log("Processing interactive message:", formattedMsg);

    // If it's a list selection
    if (req.user.interactiveType === "list") {
    }
  } else {
    // Handle text messages
    let isGreeting = greetings.some(
      (greet) => formattedMsg.trim() === greet.toLowerCase()
    );
    if (isGreeting) {
      console.log("User sends a greeting message");
      req.userMsg = "greeting";
      req.query = "";
    } else {
      // Check for specific commands
      switch (formattedMsg) {
        case "abha health schemes":
        case "abha insurance":
        case "abha registration":
        case "more about pm-jay":
        case "more on hwcs":
        case "abha care":
        case "\u2630 menu":
        case "state":
        case "improve hospisuite!":
        case "online consultation":
        case "health schemes tour":
        case "abha services": 
        case "cmhis services":
        case "abha hospitals":
          req.userMsg = formattedMsg;
          req.query = "";
          break;
        
        default:
            // If no specific command matched, check if the user enters a pincode or treat it as an AI query
            req.userMsg = formattedMsg;
            if (location === "") {
                req.query = formattedMsg;
                console.log("User typed a query, passing control to webhook controller ---->");
            } else if(location === 'awaiting pincode') {
              // wait for user to enter a pincode
                req.query = "";
                req.userMsg = formattedMsg;
                console.log(`Awaiting pincode from user: ==------------------------------------------------------- , ${formattedMsg}`);
            }else if (location === "captured pincode") {
              req.query = "";
              req.userMsg = formattedMsg;
              console.log(`User sent a pincode: --------------------------------------------------------------------  , ${formattedMsg}`);
            }else{
              console.log(`could not parse user message! , ${formattedMsg}`);
            }
            break;
      }
    }
  }

  next();
};
