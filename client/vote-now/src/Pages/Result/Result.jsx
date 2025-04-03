import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./result.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("chart");

  useEffect(() => {
    axios
      .get("/result/results")
      .then((response) => {
        setResults(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching results:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="results-container">
      <h1 className="title">Live Voting Results</h1>

      {/* Styled Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${view === "chart" ? "active" : ""}`}
          onClick={() => setView("chart")}
        >
          📊 Bar Chart View
        </button>
        <button
          className={`tab-button ${view === "table" ? "active" : ""}`}
          onClick={() => setView("table")}
        >
          📋 Table View
        </button>
      </div>

      {/* View Switching */}
      {view === "chart" ? (
        results.map((categoryResult) => {
          const maxVotes = Math.max(
            ...categoryResult.candidates.map((c) => c.votesReceived)
          );
          const leadingCandidates = categoryResult.candidates.filter(
            (c) => c.votesReceived === maxVotes
          );
          const shouldShowLeading =
            maxVotes > 0 && leadingCandidates.length === 1;

          return (
            <div key={categoryResult._id} className="category-section">
              <h2 className="category-title">{categoryResult._id} Category</h2>

              {/* Show "Leading Candidate" only if there's a single leader */}
              {shouldShowLeading && (
                <div className="leading-badge">
                  🎉 Leading: <strong>{leadingCandidates[0].name}</strong>
                </div>
              )}

              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryResult.candidates}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <XAxis dataKey="name" tick={{ fill: "#e0e0e0" }} />
                    <YAxis tick={{ fill: "#e0e0e0" }} />
                    <Tooltip
                      wrapperStyle={{
                        backgroundColor: "#222",
                        borderRadius: "5px",
                      }}
                    />
                    <Bar
                      dataKey="votesReceived"
                      fill="#00C49F"
                      barSize={40}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })
      ) : (
        <div className="table-container">
          <table className="result-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Candidate</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((categoryResult) => {
                const maxVotes = Math.max(
                  ...categoryResult.candidates.map((c) => c.votesReceived)
                );
                const leadingCandidates = categoryResult.candidates.filter(
                  (c) => c.votesReceived === maxVotes
                );
                const singleLeader =
                  maxVotes > 0 && leadingCandidates.length === 1;
                return categoryResult.candidates.map((candidate) => (
                  <tr
                    key={`${categoryResult._id}-${candidate.name}`}
                    className={
                      singleLeader && candidate.votesReceived === maxVotes
                        ? "leading-row"
                        : ""
                    }
                  >
                    <td>{categoryResult._id}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.votesReceived}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
