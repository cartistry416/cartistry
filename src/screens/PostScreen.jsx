import CommentThread from "../components/posts/CommentThread";
import Post from "../components/posts/Post";
import "../static/css/post.css";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import GlobalPostContext from "../contexts/post";
import GeoJSONMap from "../components/map/GeoJSONMap";
import Legend from "../components/map/Legend";

function PostScreen() {
  const { id } = useParams();
  const { post } = useContext(GlobalPostContext);
  const [loaded, setLoaded] = useState(false);
  // const [featureGroupRef, setFeatureGroupRef] = useState(null)
  const featureGroupRef = useRef(null)
  useEffect(() => {
    post.loadPost(id).then(() => {
      setLoaded(true);
    });
  }, []);

  useEffect(() => {}, [post.currentPost]);

  const replies = [];
  return (
    <div className="post-wrapper">
      {loaded ? (
        <>
          <div className="post-content-wrapper">
            <Post postId={id} />
            {post.currentPost &&
              post.currentPost.comments &&
              post.currentPost.comments.length > 0 && (
                <div>
                  {post.currentPost.comments.map((comment, index) => (
                    <CommentThread
                      comment={comment}
                      key={index}
                      replies={replies}
                      index={index}
                    ></CommentThread>
                  ))}
                </div>
              )}
          </div>
          <div className="post-image-wrapper">
            {post.currentPost &&
            post.currentPost.mapMetadata &&
            post.currentPost.mapMetadata !== "" ? (
              <>
                <GeoJSONMap
                mapMetadataId={post.currentPost.mapMetadata}
                position={[39.74739, -105]}
                editEnabled={false}
                featureGroupRef={featureGroupRef}
                width="100%"
                height="100%"
                />
                <Legend editEnabled={false} x='' y=''/>
              </>

            ) : (
              <div className="post-img" />
            )}
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default PostScreen;
