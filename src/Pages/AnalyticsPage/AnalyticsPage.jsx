import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "../AnalyticsPage/AnalyticsPage.module.css";
import ConfirmationPopup from "../../Components/ConfirmationPopup/ConfirmationPopup";
import CreateQuizPopup from "../../Components/CreateQuizPopup/CreateQuizPopup"; // Import CreateQuizPopup
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoShareSocialSharp } from "react-icons/io5";

function AnalyticsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showCreateQuizPopup, setShowCreateQuizPopup] = useState(false); // State for showing the Create Quiz popup

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
    if (item.type === "poll") {
      navigate(`/poll/analysis/${item._id}`);
    } else {
      navigate(`/quiz/analysis/${item._id}`);
    }
  };

  const openCreateQuizPopup = () => {
    setShowCreateQuizPopup(true);
  };

  const closeCreateQuizPopup = () => {
    setShowCreateQuizPopup(false);
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
          <li onClick={openCreateQuizPopup}>Create Quiz</li> {/* Open popup on click */}
        </ul>
        <div className={styles.logoutSection}>
          <hr className={styles.divider} />
          <button onClick={() => navigate('/signin')} className={styles.logoutButton}>
            LOGOUT
          </button>
        </div>
      </div>
      <div className={styles.mainContent}>
        <h2 className={styles.headingh2}>Quiz Analysis</h2>
        {items.length === 0 ? (
          <p>No data to show.</p>
        ) : (
          <table className={styles.analyticsTable}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Created On</th>
                <th>Impressions</th> {/* New column for Impressions */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{`Quiz ${index + 1}`}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td>{item.impressions || 0}</td> {/* Displaying the impressions value */}
                  <td className={styles.actionsColumn}>
                    <button onClick={() => handleEditItem(item)}><FaRegEdit color="#854CFF" size={"20px"} /></button>
                    <button onClick={() => handleDeleteItem(item._id, item.type)}><RiDeleteBin6Line color="#D60000" size={"20px"}  /></button>
                    <button onClick={() => handleShareItem(item)}><IoShareSocialSharp color="#60B84B" size={"20px"}   /></button>
                    <button onClick={() => handleQuestionWiseAnalysis(item)}>Question Wise Analysis</button>
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

        {showCreateQuizPopup && (
          <CreateQuizPopup onClose={closeCreateQuizPopup} /> 
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;


