import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'creativeWritingApiKey';

const OPENROUTER_KEY_LINK = 'https://openrouter.ai/keys';

const MODELS = [
	{
		id: 'openai/gpt-4o',
		name: 'GPT-4o',
		desc: 'Excellent for nuanced, creative writing and brainstorming. Fast and reliable.',
	},
	{
		id: 'anthropic/claude-3.5-sonnet',
		name: 'Claude 3.5 Sonnet',
		desc: 'Great for character development, dialogue, and literary style.',
	},
	{
		id: 'meta-llama/llama-3-70b-instruct',
		name: 'Llama 3.1 (70B)',
		desc: 'Open-source, creative, and cost-effective for long-form writing.',
	},
	{
		id: 'google/gemini-pro',
		name: 'Gemini Pro',
		desc: 'Strong at idea generation and plot structure.',
	},
	{
		id: 'mistralai/mistral-large',
		name: 'Mistral Large',
		desc: 'Balanced, creative, and good for brainstorming.',
	},
	{
		id: 'openai/gpt-3.5-turbo',
		name: 'GPT-3.5 Turbo',
		desc: 'Fast, affordable, and solid for quick creative tasks.',
	},
];

const GENRES = [
	{ id: 'fantasy', name: 'Fantasy', desc: 'Epic quests, magic, and imaginative worlds.' },
	{ id: 'scifi', name: 'Sci-Fi', desc: 'Futuristic tech, space, and speculative ideas.' },
	{ id: 'mystery', name: 'Mystery', desc: 'Whodunits, suspense, and clever twists.' },
	{ id: 'romance', name: 'Romance', desc: 'Love stories, relationships, and emotional arcs.' },
	{ id: 'nonfiction', name: 'Nonfiction', desc: 'Essays, memoir, and real-world topics.' },
	{ id: 'horror', name: 'Horror', desc: 'Chilling tales, fear, and the supernatural.' },
	{ id: 'historical', name: 'Historical', desc: 'Stories set in the past, real or imagined.' },
	{ id: 'thriller', name: 'Thriller', desc: 'High stakes, suspense, and fast-paced action.' },
	{ id: 'adventure', name: 'Adventure', desc: 'Exciting journeys, exploration, and daring feats.' },
	{ id: 'ya', name: 'Young Adult', desc: 'Coming-of-age, teen protagonists, and growth.' },
	{ id: 'childrens', name: "Children's", desc: 'Stories for young readers, often with lessons.' },
	{ id: 'poetry', name: 'Poetry', desc: 'Verse, rhythm, and expressive language.' },
	{ id: 'satire', name: 'Satire', desc: 'Humor, irony, and social commentary.' },
	{ id: 'dystopian', name: 'Dystopian', desc: 'Dark futures, societal collapse, and control.' },
	{ id: 'general', name: 'General', desc: 'Any genre or mixed styles.' },
];

const GENRE_MODEL_RECOMMENDATIONS: Record<string, string[]> = {
	fantasy: ['openai/gpt-4o', 'meta-llama/llama-3-70b-instruct'],
	scifi: ['openai/gpt-4o', 'google/gemini-pro'],
	mystery: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
	romance: ['anthropic/claude-3.5-sonnet', 'openai/gpt-3.5-turbo'],
	nonfiction: ['mistralai/mistral-large', 'openai/gpt-4o'],
	horror: ['openai/gpt-4o', 'meta-llama/llama-3-70b-instruct'],
	general: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3-70b-instruct'],
};

export default function ApiKeyManager({
	onApiKeySet,
	onModelChange,
	selectedModel,
	onGenreChange,
	selectedGenre,
}: {
	onApiKeySet?: (key: string) => void;
	onModelChange?: (model: string) => void;
	selectedModel?: string;
	onGenreChange?: (genre: string) => void;
	selectedGenre?: string;
}) {
	const [input, setInput] = useState('');
	const [apiKey, setApiKey] = useState<string | null>(null);
	const [showInput, setShowInput] = useState(false);
	const [touched, setTouched] = useState(false);
	const [model, setModel] = useState(selectedModel || MODELS[0].id);
	const [genre, setGenre] = useState(selectedGenre || 'general');

	useEffect(() => {
		const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (stored) {
			setApiKey(stored);
			if (onApiKeySet) onApiKeySet(stored);
		}
	}, [onApiKeySet]);

	useEffect(() => {
		if (onModelChange) onModelChange(model);
	}, [model, onModelChange]);

	useEffect(() => {
		if (onGenreChange) onGenreChange(genre);
	}, [genre, onGenreChange]);

	const handleSave = () => {
		if (input.trim()) {
			localStorage.setItem(LOCAL_STORAGE_KEY, input.trim());
			setApiKey(input.trim());
			setShowInput(false);
			setTouched(false);
			if (onApiKeySet) onApiKeySet(input.trim());
		}
	};

	const handleClear = () => {
		localStorage.removeItem(LOCAL_STORAGE_KEY);
		setApiKey(null);
		setInput('');
		setShowInput(true);
		if (onApiKeySet) onApiKeySet('');
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 12,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					flexWrap: 'wrap',
					justifyContent: 'center',
				}}
			>
				{/* Genre selector */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<span style={{ fontWeight: 600, fontSize: 15 }}>Genre:</span>
					<select
						value={genre}
						onChange={e => setGenre(e.target.value)}
						style={{
							borderRadius: 8,
							padding: '0.4em 1em',
							fontSize: 15,
							background: 'rgba(255,255,255,0.18)',
							color: '#213547',
							border: '1px solid #a1c4fd',
							minWidth: 120,
							cursor: 'pointer',
						}}
					>
						{GENRES.map(g => (
							<option key={g.id} value={g.id}>
								{g.name}
							</option>
						))}
					</select>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<span style={{ fontWeight: 600, fontSize: 15 }}>Model:</span>
					<select
						value={model}
						onChange={e => setModel(e.target.value)}
						style={{
							borderRadius: 8,
							padding: '0.4em 1em',
							fontSize: 15,
							background: 'rgba(255,255,255,0.18)',
							color: '#213547',
							border: '1px solid #a1c4fd',
							minWidth: 160,
							cursor: 'pointer',
						}}
					>
						{MODELS.map(m => (
							<option key={m.id} value={m.id}>
								{m.name}
							</option>
						))}
					</select>
				</div>
				<a
					href={OPENROUTER_KEY_LINK}
					target="_blank"
					rel="noopener noreferrer"
					style={{
						color: '#4ade80',
						fontWeight: 500,
						fontSize: 15,
						textDecoration: 'underline',
						marginLeft: 8,
					}}
				>
					Get OpenRouter API Key
				</a>
			</div>
			{/* Genre description */}
			<div
				style={{
					fontSize: 14,
					color: '#a1c4fd',
					margin: '0.2em 0 0.2em 0',
					textAlign: 'center',
				}}
			>
				{GENRES.find(g => g.id === genre)?.desc}
			</div>
			{/* Model recommendation for genre */}
			<div
				style={{
					fontSize: 13,
					color: '#4ade80',
					marginBottom: 2,
					textAlign: 'center',
				}}
			>
				Recommended models for this genre:{' '}
				{GENRE_MODEL_RECOMMENDATIONS[genre]
					.map(mid => MODELS.find(m => m.id === mid)?.name)
					.filter(Boolean)
					.join(', ')}
			</div>
			<div
				style={{
					maxWidth: 500,
					margin: '0.5em auto 0',
					fontSize: 14,
					color: '#a1c4fd',
					textAlign: 'center',
				}}
			>
				{MODELS.find(m => m.id === model)?.desc}
			</div>
			{apiKey ? (
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<span
						style={{
							color: '#4ade80',
							fontWeight: 600,
							fontSize: 16,
						}}
					>
						API Key Set
					</span>
					<button
						onClick={handleClear}
						title="Clear API Key"
						style={{ marginLeft: 8 }}
					>
						Change
					</button>
				</div>
			) : (
				<>
					{showInput || !apiKey ? (
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<input
								type="password"
								placeholder="Enter OpenRouter API Key"
								value={input}
								onChange={e => {
									setInput(e.target.value);
									setTouched(true);
								}}
								style={{
									padding: '0.5em',
									borderRadius: 8,
									border: '1px solid #888',
									minWidth: 200,
								}}
								autoFocus
							/>
							<button
								onClick={handleSave}
								disabled={!input.trim()}
								style={{
									background: '#646cff',
									color: '#fff',
									border: 'none',
									borderRadius: 8,
									padding: '0.5em 1em',
								}}
							>
								Save
							</button>
						</div>
					) : null}
					{touched && !input.trim() && (
						<span style={{ color: '#f87171', fontSize: 13 }}>
							API key required
						</span>
					)}
				</>
			)}
		</div>
	);
}
