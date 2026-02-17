import { Context } from "@netlify/functions";
import { GithubIssuesPayload, GithubStarPayload } from "../../interfaces";
export default async (req: Request, context: Context) => {
  const githubEvent = req.headers.get("x-github-event") ?? "unknown";
  const payload = req.body;

  // Uso

  const objeto = await streamToObject(payload);

  let message = ''
  switch (githubEvent) {
    case "star":
      message = onStar(objeto as GithubStarPayload);
      break;
    case "issues":
      message = onIssues(objeto as GithubIssuesPayload);
      break;
    default:
      console.log(`Unknown event: ${githubEvent}`);
  }
  await notify(message)
  return new Response('payload');
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

const onStar = (payload: GithubStarPayload): string => {
  const { action, sender, repository } = payload;

  return `${new Date().toUTCString()} - User ${sender.login as string} ${action} star on ${repository.full_name} `;
}

const onIssues = (payload: GithubIssuesPayload): string => {

  const { action, issue } = payload;

  if (action === "opened") {
    return `Un issue fue abierto por ${issue.user.login}. Issue => ${issue.title}`;
  }
  if (action === "closed") {
    return `Un issue fue cerrado por ${issue.user.login}. Issue => ${issue.title}`;
  }
  if (action === "reopened") {
    return `Un issue fue vuelto a abrir por ${issue.user.login}. Issue => ${issue.title}`;
  }
  if (action === "deleted") {
    return `Un issue fue eliminado por ${issue.user.login}. Issue => ${issue.title}`;
  }

  return `issue no reconocido ${action}`;
}

async function streamToObject(stream: ReadableStream<Uint8Array> | null): Promise<any> {
  if (!stream) {
    throw new Error('Stream is null');
  }

  const response = new Response(stream);
  return await response.json();
}