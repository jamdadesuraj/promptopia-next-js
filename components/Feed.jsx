"use client";

import { useState, useEffect } from "react";
import PromptCard from "@/components/PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          handleEdit={() => {}}
          handleDelete={() => {}}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleSearchChange = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    const filtered = posts.filter(
      (post) =>
        post.prompt.toLowerCase().includes(text) ||
        post.tag.toLowerCase().includes(text) ||
        post.creator.username.toLowerCase().includes(text)
    );
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="w-full flex-center relative">
        <input
          type="text"
          placeholder="Search..."
          className="search_input peer"
          onChange={handleSearchChange}
          value={searchText}
          required
        />
      </form>
      <PromptCardList data={filteredPosts} handleTagClick={() => {}} />
    </section>
  );
};

export default Feed;
