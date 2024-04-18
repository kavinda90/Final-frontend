import axios from "axios";
import React, { useEffect, useState } from "react";
import './App.css';
import './photo.css';

const Photo = (props) => {
  // console.log('photo,', props.data._id);
  const data = props.data;
  const [name, setName] = useState('');
  const [bid, setBid] = useState();
  

  const submitBid = async(event) => {
    event.preventDefault();
    if(name !== '' && bid !== '' && bid > 0){
      try {
        
        const lastbid = data.bids[data.bids.length - 1].bid;
        if(bid <= lastbid) {
          return false;
        }
        
        data.bids.push({
          user: name,
          bid: bid
        });
        const response = await axios.put(
          `${process.env.REACT_APP_API}/${data._id}`, data
        );
        if(response) {
          setName('');
          setBid('');
          this.props.onChange();
        }
      } catch (error) {
        console.log(error.response);
      }
    }
    
  }


  return (
    <div className="photo-container">
      <div className="photo">
          <img src={data.src} alt="" width="200" />
      </div>
      <div className="comments-section">
          <div>
              <h4>Bids</h4>
              <ul>
                {data.bids.map((bid) => (
                  <li><strong>{bid.user}:</strong> ${bid.bid}</li>
                ))}
              </ul>
          </div>
      </div>
      <div className="addbid">
          <form className="comment-form">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              <textarea type="number" value={bid} onChange={(e) => setBid(e.target.value)} placeholder="Add a higher bid"></textarea>
              <button onClick={submitBid}>Submit Your Higher Bid</button>
          </form>
      </div>
    </div>
  );
}

function App() {

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    handleGetPhotos();
  }, []);

  const handleGetPhotos = async () => {
    try {
      const response = await axios(
        `${process.env.REACT_APP_API}/`
      );
      setPhotos(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };


  return (
    <div className="App">
      <div className="photo-gallery">
        {photos.map((photo) => (
          <Photo data={photo} key={photo._id} onChange={handleGetPhotos}/>
        ))}
      </div>
    </div>
  );
}

export default App;
