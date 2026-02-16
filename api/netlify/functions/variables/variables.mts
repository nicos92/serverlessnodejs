export default async () => {
  const myImportantVariable = process.env.MY_IMPORTANT_VARIABLE
  console.log(`hola logs desde las variables de entorno`)
  return new Response(myImportantVariable);
};