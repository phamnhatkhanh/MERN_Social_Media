import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (err) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareHeader">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + " ?"}
            className="shareInput"
            ref={desc}
          />
        </div>

        <hr className="shareHr" />

        <form className="shareFooter" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareItem">
              <PermMedia htmlColor="tomato" className="shareSymbol" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className=" shareItem ">
              <Label htmlColor="blue" className="   shareSymbol" />
              <span className="  Text">Tag</span>
            </div>
            <div className="shareItem  ">
              <Room htmlColor="green" className="  shareSymbol " />
              <span className="  Text">Location</span>
            </div>
            <div className="shareItem  ">
              <EmojiEmotions htmlColor="goldenrod" className="  shareSymbol " />
              <span className="  Text">Feelings</span>
            </div>
          </div>
          <button className="shareNode">Share</button>
        </form>
      </div>
    </div>
  );
}
