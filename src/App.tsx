import { useEffect, useState } from "react";

type Story = {
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

  const fetchStories = async (ids: string[]) => {
    try {
      const promises = ids.map(async (id) => {
        const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
        return fetch(url).then((r) => r.json());
      });
      const data = await Promise.all(promises);
      const stories = data.map((d) => {
        return {
          score: d.score,
          title: d.title,
          url: d.url,
          by: d.by,
        };
      });
      return stories;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const load = async () => {
      const ids = await fetchIds(url);
      const data = await fetchStories(ids);
      setStories(data);
    };
    load();
  }, []);

  return (
    <div>
      <ul>
        {stories.map((s, i) => (
          <li key={i}>
            <a href={s.url}>{s.title}</a>
            <p>
              {s.score} by {s.by}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
