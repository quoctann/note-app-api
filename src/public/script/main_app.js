/* eslint-disable max-len */

/**
 * Use moment.js to make readable date time string
 * @param {string} timestamps Timestamps string get from database
 * @return {string} Formatted string
 */
function renderMoment(timestamps) {
  moment.locale('vi');
  const aWeekAgo = moment().subtract(7, 'days').startOf('day');
  // If within a week, rendering a 'sometimes from now' date string
  if (moment(timestamps).isAfter(aWeekAgo)) {
    return moment(timestamps).fromNow();
  } else {
    return moment(timestamps).format('DD/MMM/YYYY HH:MM');
  };
}

/**
   * Generate random Bootstrap 5 theme color HTML class name
   * @param {*} prefix Prefix of Bootstrap component
   * @return {*} Class name that will affected on UI
   */
function randomBootstrapTheme(prefix) {
  const bootstrapTheme = ['primary', 'secondary', 'success', 'danger',
    'warning', 'info', 'dark'];
    // eslint-disable-next-line max-len
  const randomIdx = Math.floor(Math.random() * (bootstrapTheme.length - 0) + 0);

  return prefix + '-' + bootstrapTheme[randomIdx];
}

/**
 * Perform delete note, send request into server
 * @param {*} noteObjectId Note ObjectID
 */
function removeNote(noteObjectId) {
  const isForSureDelete = confirm(
      `Are you sure delete this note, this action can't be undo`,
  );

  if (isForSureDelete) {
    $.ajax({
      url: '/note/' + noteObjectId,
      method: 'DELETE',
      success: function(data) {
        // Remove element on UI
        alert('Note removed');
        document.getElementById(noteObjectId).remove();
      },
      error: function(data) {
        alert('Error');
        console.log('An error occur', data);
      },
      complete: function(data) {
        // console.log(data);
      },
    });
  }
}

/**
 * Filter notes by topics
 * @param {*} topicObjId Topic ObjectID
 */
function filterByTopicId(topicObjId) {
  // Validate information
  if (null === topicObjId || undefined === topicObjId || '' === topicObjId) {
    return;
  }

  if (topicObjId === 'all') {
    location.reload();
    return;
  }

  $.ajax({
    url: '/topic?topicId=' + topicObjId,
    method: 'GET',
    success: function(data) {
      // Empty current displaying notes
      const noteContainer = $('#note-container');
      noteContainer.empty();

      if (data.notes === []) {
        return;
      }

      let filteredData = ``;

      data.notes.forEach((note) => {
        let idList = '';
        let badgeTopicItems = ``;
        const formattedDate = renderMoment(note.createdAt);

        note.topics.forEach((topic) => {
          idList += topic._id + ',';
          const theme = randomBootstrapTheme('bg');
          badgeTopicItems += `
            <span class="badge rounded-pill my-1 ${theme}">
              <a href="#" class="text-decoration-none link-light"
                onclick="filterByTopicId('${topic._id}')">${topic.title}</a>
            </span>
          `;
        });

        const noteElement = `
            <div class="item col-sm-6 col-lg-4 mb-3" id="${note._id}">
              <div class="card">
                <div class="card-body">
                <h5 class="card-title">${note.title}</h5>
                <p class="card-text">${note.content}</p>
                <p class="card-text">
                  Topics:
                  ${badgeTopicItems}
                </p>
                <p class="card-text">
                  <i class="fa-regular fa-calendar"></i> ${formattedDate}
                </p>
                <a href="#" 
                  class="btn btn-primary" 
                  id="btn-edit-note"
                  data-bs-toggle="modal" 
                  data-bs-target="#updateNoteModal"
                  data-title="${note.title}"
                  data-content="${note.content}"
                  data-id="${note._id}"
                  data-related-topic="${idList}">                  
                  <i class="fa-solid fa-edit"></i> Edit
                </a>
                <a href="#"
                  class="btn btn-danger"
                  id="btnTrashNote"
                  data-note-id="${note._id}" 
                  onclick="removeNote('${note._id}')">
                  <i class="fa-solid fa-trash"></i> Trash
                </a>
                </div>
              </div>
            </div>
          `;
        filteredData += noteElement;
      });
      noteContainer.append(filteredData);
    },
    error: function(data) {
      alert('Error');
      console.log('An error occur', data);
    },
    complete: function(data) {
      // console.log(data);
    },
  });
}

// Handle click for toggle edit note button, this method is more elegant
$(document).on('click', '#btn-edit-note', function() {
  const objId = $(this).data('id');
  const title = $(this).data('title');
  const content = $(this).data('content');
  const relTopics = $(this).data('related-topic').split(',');

  // console.log(relTopics)
  // Fill data into update modal
  $('#updateNoteModal #update-note-content').val(content);
  $('#updateNoteModal #update-note-title').val(title);
  $('#updateNoteModal #update-related-topics').val(relTopics);
  $('#updateNoteModal #update-note-object-id').val(objId);
});

// Handle click for toggle edit topic button, this method is more elegant
$(document).on('click', '#btn-edit-topic', function() {
  const objId = $(this).data('id');
  const title = $(this).data('title');
  const description = $(this).data('description');

  // Fill data into update modal
  $('#updateTopicModal #update-topic-description').val(description);
  $('#updateTopicModal #update-topic-title').val(title);
  $('#updateTopicModal #update-topic-object-id').val(objId);
});

// Update single Note
$(document).ready(function() {
  $('#form-update-note').submit(function(event) {
    event.preventDefault();
    const formData = $('#form-update-note').serialize();
    const noteObjectId = $('#update-note-object-id').val();

    $.ajax({
      url: '/note/' + noteObjectId,
      method: 'PUT',
      data: formData,
      success: function(data) {
        alert('Updated');
        filterByTopicId('all');
      },
      error: function(data) {
        alert('Error');
        console.log('An error occur\n', data);
      },
    });
  });
});

// Update single Topic
$(document).ready(function() {
  $('#form-update-topic').submit(function(event) {
    event.preventDefault();
    const formData = $('#form-update-topic').serialize();
    const topicObjectId = $('#update-topic-object-id').val();

    $.ajax({
      url: '/topic/' + topicObjectId,
      method: 'PUT',
      data: formData,
      success: function(data) {
        alert('Updated');
        filterByTopicId('all');
      },
      error: function(data) {
        alert('Error');
        console.log('An error occur\n', data);
      },
    });
  });
});
