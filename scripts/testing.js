function showSvg() {
  const svgElement = document.getElementById('mySvg');
  svgElement.style.display = 'block';
}

// Function to make API requests to the Instagram API
async function makeRequest(endpoint, params) {
  const accessToken = 'IGQVJValFlVFpibVllZAUl2TnI1ZATFVdW50T0RlQzZA4NFhud2ZAPdTJrTkVic2RnT3NheVNzRmNKdWdVQllEWUVoSUlTMWRxT0U2Wmw1Q3c0YmxGQVpNTmVPNm5qaGNlRF9CdkI3ZAE1sdnp2ZAVVMSkJpMQZDZD'; // Replace with your access token
  const apiUrl = `https://api.instagram.com/${endpoint}?access_token=${accessToken}`;

  try {
    const response = await axios.get(apiUrl, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to retrieve user ID given their username
async function getUserID(username) {
  const params = {
    q: username
  };

  try {
    const response = await makeRequest('v1/users/search', params);
    const user = response.data[0];
    if (user) {
      return user.id;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    alert('Not a Valid Username or Account Is Still Private, try Again');
    throw error;
  }
}

// Function to retrieve user's followers
async function getFollowers(userID) {
  const params = {
    count: 200 // Retrieve up to 200 followers per API call
  };

  let allFollowers = [];
  let pagination = null;

  try {
    do {
      if (pagination) {
        params.cursor = pagination.next_cursor;
      }
      const response = await makeRequest(`v1/users/${userID}/followed-by`, params);
      allFollowers = allFollowers.concat(response.data);
      pagination = response.pagination;
    } while (pagination && pagination.next_cursor);
    
    const followers = allFollowers.map(follower => follower.username);
    followers.sort();
    return followers;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to retrieve user's following
async function getFollowing(userID) {
  const params = {
    count: 200 // Retrieve up to 200 following users per API call
  };

  let allFollowing = [];
  let pagination = null;

  try {
    do {
      if (pagination) {
        params.cursor = pagination.next_cursor;
      }
      const response = await makeRequest(`v1/users/${userID}/follows`, params);
      allFollowing = allFollowing.concat(response.data);
      pagination = response.pagination;
    } while (pagination && pagination.next_cursor);
    
    const following = allFollowing.map(followingUser => followingUser.username);
    following.sort();
    return following;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
