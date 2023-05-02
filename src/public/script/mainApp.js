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
        const noteElement = `
            <div class="item col-sm-6 col-lg-4 mb-3" id="${note._id}">
              <div class="card">
                <div class="card-body">
                <h5 class="card-title">${note.title}</h5>
                <p class="card-text">${note.content}</p>
                <p class="card-text">
                  <i class="fa-regular fa-calendar"></i> ${note.createdAt}
                </p>
                <a href="#" 
                  class="btn btn-primary" 
                  id="btnEditNote"
                  data-bs-toggle="modal" 
                  data-bs-target="#updateNoteModal"
                  data-title="${note.title}"
                  data-content="${note.content}"
                  data-id="${note._id}"
                  data-related-topic="${note.topics}">                  
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
$(document).on('click', '#btnEditNote', function() {
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

// TODO: Modify this code here to update single document
// Manual update note (POST)
$(document).ready(function() {
  $('#form-update-note').submit(function(event) {
    const formData = {
      name: $('#name').val(),
      email: $('#email').val(),
      superheroAlias: $('#superheroAlias').val(),
    };

    $.ajax({
      type: 'PUT',
      url: '/note/update/' + 'ID UPDATE LATER HERE',
      data: formData,
      dataType: 'json',
      encode: true,
    }).done(function(data) {
      console.log(data);
    });

    event.preventDefault();
  });
});
