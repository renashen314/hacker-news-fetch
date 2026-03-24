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

  const fetchStories = async (ids: string[]) => {
    try {
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
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    const loadTop10Stories = async () => {
      setIsLoading(true);
      const ids = await fetchIds(url);
      const data = await fetchStories(ids);
      setStories(data);
      setIsLoading(false);
    };
    loadTop10Stories();
  }, []);

  return (
    <div>
      <ul>
        {isLoading && <div>Loading...</div>}
        {!isLoading &&
          stories.map((story) => (
            <li key={story.id}>
              <a href={story.url}>{story.title}</a>
              <p>
                {story.score} by {story.by}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
