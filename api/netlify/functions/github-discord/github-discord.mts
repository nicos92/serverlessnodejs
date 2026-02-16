export default async () => {
  await notify('Hola mundo desde notify dev')
  return new Response('ok');
};


const notify = async (message: string) => {
  const body = {
    content: message,

  };

  const response = await fetch(process.env.DISCORD_WEBHOOK_URL ?? '', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error('Error sending message to discord')
    return false;
  }

  return true;

}