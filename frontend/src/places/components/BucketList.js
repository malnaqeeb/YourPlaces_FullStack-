import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import BucketListItem from "./BucketListItem";
import useHttpClient from "../../shared/hooks/http-hook";
import "./BucketList.css";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

let herokuLink = "";
const BucketList = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [places, setPlaces] = useState();
  const { userId } = useParams();
  const auth = useContext(AuthContext);
  const deleteFromBucketList = id => {
    setPlaces(prevPlaces => prevPlaces.filter(place => place.id._id !== id));
  };
  useEffect(() => {
    const getBucketList = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}/mybucketlist`
        );
        setPlaces(data.userWithBucketList);
      } catch (err) {}
    };
    getBucketList();
  }, [sendRequest, userId]);
  const [user, setUser] = useState();
  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/`
        );
        setUser(data);
      } catch (err) {}
    };
    getUser();
  }, [sendRequest, userId]);
  if (isLoading)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div>
      <div className="share-box">
        <div className="share-button">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              `${herokuLink}/${userId}/mybucketlist`
            )}&text=My%2C+Travel%2C+Bucket%2C+List.&hashtags=travelling,wanderlust,yourplacesapp`}
          >
            <i className="fab fa-twitter-square"></i>
          </a>
          <a
            href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
              `${herokuLink}/${userId}/mybucketlist`
            )}`}
          >
            <i className="fab fa-facebook-square"></i>
          </a>
        </div>
        <p>SHARE</p>
      </div>
      <React.Fragment>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className="center yellow-text">
          Bucket List of{" "}
          <span className="pink-text"> {user && user.user.name}</span>{" "}
        </h2>

        {!isLoading && userId === auth.userId && !places && (
          <h2
            className="center yellow-text"
            style={{ flexDirection: "column" }}
          >
            You don't have any places in your bucket list. Maybe check some
            places?
            <Link to="/"> Go to home</Link>
          </h2>
        )}
        {userId !== auth.userId && (error || !places) && (
          <h2 className="center yellow-text">
            This user does not have any places in their bucket list
          </h2>
        )}
        <div className="bucket-list-content">
          {places &&
            places.map((bucket, index) => {
              return (
                <React.Fragment>
                  <BucketListItem
                    bucket={bucket}
                    key={index}
                    index={index}
                    deleteBucket={deleteFromBucketList}
                  />
                </React.Fragment>
              );
            })}
        </div>
      </React.Fragment>
    </div>
  );
};

export default BucketList;
