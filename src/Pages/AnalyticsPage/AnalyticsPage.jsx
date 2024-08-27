import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "../AnalyticsPage/AnalyticsPage.module.css";
import ConfirmationPopup from "../../Components/ConfirmationPopup/ConfirmationPopup";

function AnalyticsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/quiz/analytics/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [userId]);

  const handleShareItem = async (item) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/${item.type === "poll" ? "poll" : "quiz"}/id/${item._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data && response.data.uniqueId) {
        const shareableLink = `${window.location.origin}/${
          item.type === "poll" ? "poll" : "sharedquiz"
        }/${response.data.uniqueId}`;
        await navigator.clipboard.writeText(shareableLink);
        toast.success("Link copied to clipboard");
      } else {
        toast.error("Failed to generate share link");
      }
    } catch (error) {
      toast.error("Failed to fetch the share link");
    }
  };

  const handleDeleteItem = (itemId, itemType) => {
    setItemToDelete({ id: itemId, type: itemType === "poll" ? "poll" : "quiz" });
    setShowDeletePopup(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) {
      toast.error("No item selected for deletion");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/${itemToDelete.type}/delete/${itemToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setItems(items.filter((item) => item._id !== itemToDelete.id));
        toast.success("Item deleted successfully");
      } else {
        toast.error("Failed to delete the item");
      }
    } catch (error) {
      toast.error("Failed to delete the item");
    } finally {
      setShowDeletePopup(false);
      setItemToDelete(null);
    }
  };

  const handleEditItem = (item) => {
    navigate(`/quiz/edit/${item._id}`, {
      state: { item }, // Passing the quiz data via state
    });
  };

  const handleQuestionWiseAnalysis = (item) => {
    navigate(`/quiz/analysis/${item._id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>QUIZZIE</div>
        <ul className={styles.navList}>
          <li onClick={() => navigate(`/dashboard/${userId}`)}>Dashboard</li>
          <li className={styles.active}>Analytics</li>
          <li onClick={() => navigate(`/quiz/create`)}>Create Quiz</li>
        </ul>
        <div className={styles.logoutSection}>
          <hr className={styles.divider} />
          <button onClick={() => navigate('/signin')} className={styles.logoutButton}>
            LOGOUT
          </button>
        </div>
      </div>
      <div className={styles.mainContent}>
        <h2>Quiz Analysis</h2>
        {items.length === 0 ? (
          <p>No data to show.</p>
        ) : (
          <table className={styles.analyticsTable}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Created On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{`Quiz ${index + 1}`}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td className={styles.actionsColumn}>
                    <button onClick={() => handleQuestionWiseAnalysis(item)}>Question Wise Analysis</button>
                    <button onClick={() => handleShareItem(item)}>Share</button>
                    <button onClick={() => handleEditItem(item)}>Edit</button>
                    <button onClick={() => handleDeleteItem(item._id, item.type)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showDeletePopup && (
          <ConfirmationPopup
            message="Are you sure you want to delete this item?"
            onConfirm={confirmDeleteItem}
            onCancel={() => setShowDeletePopup(false)}
          />
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;
