export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const base64 = new Uint8Array(arrayBuffer).toBase64()

  const { text } = await $fetch<{ text: string }>("/api/pdf/extract-text", {
    method: "POST",
    body: { pdf: base64 }
  })

  return text
}
