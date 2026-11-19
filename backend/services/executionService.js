const axios = require('axios')

const languageAliases = {
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
}

const normalize = (result) => ({
  stdout: result.run?.stdout || result.stdout || '',
  stderr: result.run?.stderr || result.stderr || '',
  compileOutput: result.compile?.output || result.compile_output || '',
  exitCode: result.run?.code ?? result.exit_code ?? null,
  status: result.run?.signal ? `terminated (${result.run.signal})` : result.status?.description || 'Completed',
  time: result.run?.time || result.time || null,
  memory: result.run?.memory || result.memory || null,
})

const executeWithPiston = async (code, language) => {
  const runtime = languageAliases[language]
  if (!runtime) throw new Error(`Unsupported language: ${language}`)
  const response = await axios.post(
    process.env.PISTON_URL || 'https://emkc.org/api/v2/piston/execute',
    { language: runtime.language, version: runtime.version, files: [{ content: code }] },
    { timeout: 30000 },
  )
  return normalize(response.data)
}

const executeWithJudge0 = async (code, language) => {
  const runtime = languageAliases[language]
  if (!runtime) throw new Error(`Unsupported language: ${language}`)
  const headers = process.env.JUDGE0_KEY ? { 'X-RapidAPI-Key': process.env.JUDGE0_KEY } : {}
  const response = await axios.post(
    `${process.env.JUDGE0_URL.replace(/\/$/, '')}/submissions?base64_encoded=false&wait=true`,
    { source_code: code, language_id: { javascript: 63, typescript: 74, python: 71, java: 62, cpp: 54 }[language] },
    { headers, timeout: 30000 },
  )
  return normalize(response.data)
}

const executeCode = (code, language) => {
  if (process.env.JUDGE0_URL) return executeWithJudge0(code, language)
  if (process.env.PISTON_URL) return executeWithPiston(code, language)
  throw new Error('Code execution is not configured. Set JUDGE0_URL or PISTON_URL in backend/.env.')
}

module.exports = executeCode
