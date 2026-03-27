import { useEffect, useState } from "react";

type Story = {
  id: number;
  score: string;
  title: string;
  url: string;
  by: string;
};

function App() {
  const url =
    "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";

  const fetchIds = async (url: string) => {
    const response = await fetch(url);
    const json = await response.json();
    return json.slice(0, 10);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState("");

  const fetchStories = async (ids: string[]) => {
    const promises = ids.map(async (id) => {
      const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
      return fetch(url).then((r) => r.json());
    });
    const data = await Promise.all(promises);
    const stories = data.map((d) => {
      return {
        id: d.id,
        score: d.score,
        title: d.title,
        url: d.url,
        by: d.by,
      };
    });
    return stories;
  };

  useEffect(() => {
    const loadTop10Stories = async () => {
      try {
        setIsLoading(true);
        const ids = await fetchIds(url);
        const data = await fetchStories(ids);
        setStories(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("There is an error");
      }
    };
    loadTop10Stories();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Hacker News Top Stories</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading && <div className="text-gray-500">Loading...</div>}
      <ul className="space-y-4">
        {!isLoading &&
          stories.map((story) => (
            <li key={story.id} className="border border-gray-200 rounded p-4">
              <a
                href={story.url}
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noreferrer"
              >
                {story.title}
              </a>
              <p className="text-sm text-gray-500 mt-1">
                {story.score} points by {story.by}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
