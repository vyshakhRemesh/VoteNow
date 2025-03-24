import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./result.css";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the voting results from the backend
    axios
      .get("/result/results")
      .then((response) => {
        console.log("the result is ", response.data);

        setResults(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the results!", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  // Find the maximum votes in all categories for width calculation
  const getMaxVotes = (category) => {
    return Math.max(
      ...category.candidates.map((candidate) => candidate.votesReceived)
    );
  };

  return (
    <div className="results-container">
      <h1>Voting Results</h1>
      {results.map((categoryResult) => {
        const maxVotes = getMaxVotes(categoryResult);
        return (
          <div key={categoryResult._id} className="category">
            <h2>{categoryResult._id} Category</h2>
            <ul className="candidate-list">
              {categoryResult.candidates.map((candidate, index) => {
                // Calculate the width of the vote bar based on the ratio
                const voteBarWidth = (candidate.votesReceived / maxVotes) * 100;

                // Check if this candidate has the highest vote count in the category
                const isMax = candidate.votesReceived === maxVotes;

                return (
                  <li key={index} className="candidate-item">
                    <span className="candidate-name">{candidate.name}</span>
                    <span className="votes-count">
                      {candidate.votesReceived} votes
                      <div className="vote-bar-container">
                        <div
                          className={`vote-bar ${isMax ? "green" : ""}`}
                          style={{ width: `${voteBarWidth}%` }}
                        ></div>
                      </div>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsPage;
