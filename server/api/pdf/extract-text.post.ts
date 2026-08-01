export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as { pdf: string }

  if (!body.pdf) {
    throw createError({
      statusCode: 400,
      statusMessage: "PDF data is required"
    })
  }

  try {
    // Use legacy build for Node.js (modern build requires browser APIs like DOMMatrix)
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs")

    // Point workerSrc to the legacy worker so the fake worker can import it
    pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/legacy/build/pdf.worker.mjs"

    const uint8Array = Uint8Array.fromBase64(body.pdf)
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
    const pdf = await loadingTask.promise

    const pageTexts: string[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .filter((item) => "str" in item)
        .map((item) => (item as { str: string }).str)
        .join(" ")
      pageTexts.push(pageText)
    }

    return { text: pageTexts.join("\n\n") }
  } catch (error: unknown) {
    console.error("PDF text extraction error:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to extract text from PDF"
    })
  }
})
