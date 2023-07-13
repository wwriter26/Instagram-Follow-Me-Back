function showSvg() {
  const svgElement = document.getElementById('mySvg');
  svgElement.style.display = 'block';
}



async function getUserID(username){ // getting the users id number given their username

  const options3 = {
    method: 'GET',
    url: 'https://instagram-scraper-2022.p.rapidapi.com/ig/user_id/',
    params: {
      user: username
    },
    headers: {
      'X-RapidAPI-Key': 'c07cad21f6mshf988cf17f6a6e9ep1d9e64jsn8e9bdafc25cc',
      'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options3);
    result = response.data.id;
    // console.log(result);
    return result; 
  } catch (error) {
    alert('Not a Valid Username or Account Is Still Private, try Again'); 
    console.error(error);
  }
}
getUserID('william.writer');


//accessing the instagram data from RapidAPI
function getFollowers(userID){
  const options = {
    method: 'GET',
    url: 'https://instagram-scraper-2022.p.rapidapi.com/ig/followers/',
    params: {
      id_user: userID
    },
    headers: {
      'X-RapidAPI-Key': 'c07cad21f6mshf988cf17f6a6e9ep1d9e64jsn8e9bdafc25cc',
      'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com'
    }
  };
  
  //accessing the followers given the info from above
  return new Promise((resolve, reject) => {
    axios.request(options)
      .then(response => {
        const followers = response.data.users;

        if (Array.isArray(followers)) {
          const usernames = followers.map(follower => follower.username);
          usernames.sort();

          const followingUsers = usernames.join(' ').split(' ');
          console.log(response.data);
          resolve(followingUsers);
        } else {
          alert('Not a Valid Username or Account Is Still Private, try Again'); 
          reject(new Error('Followers data is not an array'));
        }
      })
      .catch(error => {
        alert('Not a Valid Username or Account Is Still Private, try Again'); 
        reject(error);
      });
  });
}



  //following users from the rapidAPI
function getFollowing(userID) {
  const options2 = {
    method: 'GET',
    url: 'https://instagram-scraper-2022.p.rapidapi.com/ig/following/',
    params: {
      id_user: userID
    },
    headers: {
      'X-RapidAPI-Key': 'c07cad21f6mshf988cf17f6a6e9ep1d9e64jsn8e9bdafc25cc',
      'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com'
    }
  };

  return new Promise((resolve, reject) => {
    axios.request(options2)
      .then(response => {
        const followers = response.data.users;

        if (Array.isArray(followers)) {
          const usernames = followers.map(follower => follower.username);
          usernames.sort();

          const followingUsers = usernames.join(' ').split(' ');
          console.log(response.data.users.sort());
          resolve(followingUsers);
        } else {
          alert('Not a Valid Username or Account Is Still Private, try Again'); 
          reject(new Error('Followers data is not an array'));
        }
      })
      .catch(error => {
        alert('Not a Valid Username or Account Is Still Private, try Again'); 
        reject(error);
      });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  var logIn = document.querySelector('.find-account');
  logIn.addEventListener('click', function() {
    nameInput = document.querySelector('.input').value;
    getUserID(nameInput)
      .then(userID => {
        let notFollowingUser = [];
        let count = 0;

        getFollowing(userID)
          .then(followingArray => {
            getFollowers(userID)
              .then(followersArray => {
                
                for(let i = 0; i < followingArray.length; i++){ // adding to the notFollowingUser array
                  if(followersArray.includes(followingArray[i])){
                    continue;
                  }else{
                    notFollowingUser[count] = followingArray[i];
                    count++;
                  }
                }
                const notFollowingList = document.getElementById('notFollowingList');
    
                notFollowingUser.forEach(user => {
                  const li = document.createElement('li'); // creates a <li> element that represents an item in a list 
                  li.textContent = user; // retrieves the text content of the specified node and its descendants.
                  notFollowingList.appendChild(li); //uses the appendChild() method to add the <li> element to the end of the child nodes of the notFollowingList element.
                });
                //hiding the loading bar after everything has been ran
                const svgElement = document.getElementById('mySvg');
                svgElement.style.display = 'none';
              })
              .catch(error => {
                console.error(error);
              });
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  });
});

