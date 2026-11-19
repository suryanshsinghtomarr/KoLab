const languages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'html', 'css', 'json']

export default function LanguageSelector({ language, onChange }) {
  return <label className="language-selector">Language<select value={language} onChange={(event) => onChange(event.target.value)}>{languages.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
}
