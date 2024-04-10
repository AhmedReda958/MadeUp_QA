const { env } = process;
import events from "./emitter.mjs";
import { notify } from "##/one-signal.mjs";
import User from "##/database/models/user/index.mjs";

events.on("MessageSent", async ({ sender, anonymous, content, receiver }) => {
  let data = { content };
  if (!anonymous)
    try {
      let senderUser = await User.findById(sender, { username: 1 });
      if (senderUser) data.sender = senderUser.username;
    } catch (err) {
      console.error(err); // TODO: log errors
    }
    
  notify({
    template_id: env.ONESIGNAL_TEMPLATE_MESSAGE_RECEIVED,
    include_external_user_ids: [receiver],
    custom_data: data
  });
});

events.on("MessageReplied", async ({ _id, receiver: replier, reply, sender }) => {
  if (!sender) return;

  let data = { reply: reply.content };
  try {
    let replierUser = await User.findById(replier, { username: 1 });
    if (replierUser) data.replier = replierUser.username;
  } catch (err) {
    console.error(err); // TODO: log errors
  }

  notify({
    template_id: env.ONESIGNAL_TEMPLATE_MESSAGE_REPLIED,
    include_external_user_ids: [sender.toString()],
    url: 'https://madeup.vercel.app/message/' + _id, // TODO: configure
    custom_data: data
  });
});
