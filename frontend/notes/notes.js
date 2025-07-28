
        let folders = [];
        let notes = [];
        let currentNoteId = null;
        let currentFolderId = null;
        let noteIdCounter = 1;
        let folderIdCounter = 1;
        let sidebarCollapsed = false;
        let createModalType = 'note';

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            loadData();
            renderContent();
            
            // Load sample data if empty
            if (folders.length === 0 && notes.length === 0) {
                createSampleData();
            }

            // Close modal on outside click
            document.getElementById('createModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    hideCreateModal();
                }
            });

            // Enter key in modal
            document.getElementById('modalInput').addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    confirmCreate();
                }
            });
        });

        function createSampleData() {
            const demo_parent_folder = {
                id: folderIdCounter++,
                name: "Demo Parent folder",
                parentId: null,
                expanded: true
            };

            const personalFolder = {
                id: folderIdCounter++,
                name: "Personal",
                parentId: null,
                expanded: false
            };

            const meetingsFolder = {
                id: folderIdCounter++,
                name: "Meetings",
                parentId: demo_parent_folder.id,
                expanded: false
            };

            folders = [demo_parent_folder, personalFolder, meetingsFolder];

            const sampleNotes = [
                {
                    id: noteIdCounter++,
                    title: "Welcome to NotesFlow",
                    content: "This is your first note! NotesFlow now supports:<br><br>• Folders and subfolders<br>• Collapsible sidebar<br>• Drag and drop organization<br>• Rich text formatting<br><br>Start organizing your notes with folders!",
                    lastModified: new Date().toISOString(),
                    preview: "This is your first note! NotesFlow now supports...",
                    folderId: demo_parent_folder.id
                },
                {
                    id: noteIdCounter++,
                    title: "Meeting Notes Template",
                    content: "📅 Date: [Insert Date]<br>👥 Attendees: [List attendees]<br>🎯 Agenda:<br>1. [Topic 1]<br>2. [Topic 2]<br><br>📝 Notes:<br>[Your notes here]<br><br>✅ Action Items:<br>• [Action 1] - [Owner]<br>• [Action 2] - [Owner]",
                    lastModified: new Date().toISOString(),
                    preview: "📅 Date: [Insert Date] 👥 Attendees: [List attendees]...",
                    folderId: meetingsFolder.id
                },
                {
                    id: noteIdCounter++,
                    title: "Quick Ideas",
                    content: "Random thoughts and ideas:<br><br>• App improvement suggestions<br>• Book recommendations<br>• Travel destinations<br>• Recipe ideas",
                    lastModified: new Date().toISOString(),
                    preview: "Random thoughts and ideas...",
                    folderId: personalFolder.id
                }
            ];

            notes = sampleNotes;
            saveData();
            renderContent();
        }

        function loadData() {
            const savedFolders = localStorage.getItem('notesflow-folders');
            const savedNotes = localStorage.getItem('notesflow-notes');
            
            if (savedFolders) {
                try {
                    folders = JSON.parse(savedFolders);
                    folderIdCounter = Math.max(...folders.map(f => f.id), 0) + 1;
                } catch (e) {
                    folders = [];
                }
            }
            
            if (savedNotes) {
                try {
                    notes = JSON.parse(savedNotes);
                    noteIdCounter = Math.max(...notes.map(n => n.id), 0) + 1;
                } catch (e) {
                    notes = [];
                }
            }
        }

        function saveData() {
            localStorage.setItem('notesflow-folders', JSON.stringify(folders));
            localStorage.setItem('notesflow-notes', JSON.stringify(notes));
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const hamburger = document.querySelector('.hamburger');
            const editorContainer = document.getElementById('editorContainer');
            
            sidebarCollapsed = !sidebarCollapsed;
            
            if (sidebarCollapsed) {
                sidebar.classList.add('collapsed');
                editorContainer.classList.add('sidebar-collapsed');
            } else {
                sidebar.classList.remove('collapsed');
                editorContainer.classList.remove('sidebar-collapsed');
            }
            
            hamburger.classList.toggle('active', !sidebarCollapsed);
        }

        function renderContent() {
            const contentArea = document.getElementById('contentArea');
            contentArea.innerHTML = '';

            // Render root folders first
            const rootFolders = folders.filter(f => f.parentId === null);
            rootFolders.forEach(folder => {
                renderFolder(folder, contentArea);
            });

            // Render root notes (notes without folder)
            const rootNotes = notes.filter(n => !n.folderId);
            rootNotes.forEach(note => {
                renderNote(note, contentArea);
            });

            if (folders.length === 0 && notes.length === 0) {
                contentArea.innerHTML = '<div style="text-align: center; padding: 2rem; opacity: 0.6;">No content yet. Create your first folder or note!</div>';
            }
        }

        function renderFolder(folder, container) {
            const folderDiv = document.createElement('div');
            folderDiv.className = 'folder';
            
            const folderHeader = document.createElement('div');
            folderHeader.className = 'folder-header';
            folderHeader.innerHTML = `
                <span class="folder-toggle ${folder.expanded ? 'expanded' : ''}">▶</span>
                <span class="folder-icon">📁</span>
                <span class="folder-name">${folder.name}</span>
                <div class="folder-actions">
                    <button class="action-btn" onclick="showCreateModal('note', ${folder.id})" title="Add Note">📝</button>
                    <button class="action-btn" onclick="showCreateModal('folder', ${folder.id})" title="Add Subfolder">📁</button>
                    <button class="action-btn" onclick="renameFolder(${folder.id})" title="Rename">✏️</button>
                    <button class="action-btn" onclick="deleteFolder(${folder.id})" title="Delete">🗑️</button>
                </div>
            `;
            
            folderHeader.onclick = (e) => {
                if (!e.target.classList.contains('action-btn')) {
                    toggleFolder(folder.id);
                }
            };

            const folderContent = document.createElement('div');
            folderContent.className = `folder-content ${folder.expanded ? 'expanded' : ''}`;

            // Add subfolders
            const subfolders = folders.filter(f => f.parentId === folder.id);
            subfolders.forEach(subfolder => {
                renderFolder(subfolder, folderContent);
            });

            // Add notes in this folder
            const folderNotes = notes.filter(n => n.folderId === folder.id);
            folderNotes.forEach(note => {
                renderNote(note, folderContent);
            });

            folderDiv.appendChild(folderHeader);
            folderDiv.appendChild(folderContent);
            container.appendChild(folderDiv);
        }

        function renderNote(note, container) {
            const noteDiv = document.createElement('div');
            noteDiv.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
            noteDiv.onclick = () => openNote(note.id);
            
            const date = new Date(note.lastModified).toLocaleDateString();
            
            noteDiv.innerHTML = `
                <div class="note-title">${note.title}</div>
                <div class="note-preview">${note.preview}</div>
                <div class="note-date">${date}</div>
                <div class="folder-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); deleteNote(${note.id})" title="Delete">🗑️</button>
                </div>
            `;
            
            container.appendChild(noteDiv);
        }

        function toggleFolder(folderId) {
            const folder = folders.find(f => f.id === folderId);
            if (folder) {
                folder.expanded = !folder.expanded;
                saveData();
                renderContent();
            }
        }

        function showCreateModal(type, parentId = null) {
            createModalType = type;
            currentFolderId = parentId;
            
            const modal = document.getElementById('createModal');
            const header = document.getElementById('modalHeader');
            const input = document.getElementById('modalInput');
            
            if (type === 'folder') {
                header.textContent = parentId ? 'Create Subfolder' : 'Create Folder';
                input.placeholder = 'Enter folder name...';
            } else {
                header.textContent = 'Create Note';
                input.placeholder = 'Enter note title...';
            }
            
            input.value = '';
            modal.classList.add('show');
            input.focus();
        }

        function hideCreateModal() {
            document.getElementById('createModal').classList.remove('show');
        }

        function confirmCreate() {
            const input = document.getElementById('modalInput');
            const name = input.value.trim();
            
            if (!name) return;
            
            if (createModalType === 'folder') {
                createFolder(name, currentFolderId);
            } else {
                createNote(name, currentFolderId);
            }
            
            hideCreateModal();
        }

        function createFolder(name, parentId) {
            const newFolder = {
                id: folderIdCounter++,
                name: name,
                parentId: parentId,
                expanded: true
            };
            
            folders.push(newFolder);
            saveData();
            renderContent();
        }

        function createNote(title, folderId) {
            const newNote = {
                id: noteIdCounter++,
                title: title || "Untitled Note",
                content: "",
                lastModified: new Date().toISOString(),
                preview: "New note...",
                folderId: folderId
            };

            notes.unshift(newNote);
            saveData();
            renderContent();
            openNote(newNote.id);
        }

        function deleteFolder(folderId) {
            if (confirm('Delete this folder and all its contents?')) {
                // Delete all notes in folder and subfolders
                const foldersToDelete = [folderId];
                const getAllSubfolders = (id) => {
                    const subs = folders.filter(f => f.parentId === id);
                    subs.forEach(sub => {
                        foldersToDelete.push(sub.id);
                        getAllSubfolders(sub.id);
                    });
                };
                getAllSubfolders(folderId);
                
                notes = notes.filter(n => !foldersToDelete.includes(n.folderId));
                folders = folders.filter(f => !foldersToDelete.includes(f.id));
                
                saveData();
                renderContent();
                
                if (currentNoteId && !notes.find(n => n.id === currentNoteId)) {
                    showWelcomeScreen();
                }
            }
        }

        function deleteNote(noteId) {
            if (confirm('Delete this note?')) {
                notes = notes.filter(n => n.id !== noteId);
                saveData();
                renderContent();
                
                if (currentNoteId === noteId) {
                    showWelcomeScreen();
                }
            }
        }

        function renameFolder(folderId) {
            const folder = folders.find(f => f.id === folderId);
            if (!folder) return;
            
            const newName = prompt('Enter new folder name:', folder.name);
            if (newName && newName.trim()) {
                folder.name = newName.trim();
                saveData();
                renderContent();
            }
        }

        function openNote(noteId) {
            const note = notes.find(n => n.id === noteId);
            if (!note) return;

            currentNoteId = noteId;
            
            // Hide welcome screen and show editor
            document.getElementById('welcomeScreen').style.display = 'none';
            document.getElementById('editorPanel').style.display = 'flex';
            
            // Update editor content
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteEditor').innerHTML = note.content;
            
            // Update breadcrumb
            updateBreadcrumb(note.folderId);
            
            // Update active state in sidebar
            renderContent();
        }

        function updateBreadcrumb(folderId) {
            const breadcrumb = document.getElementById('breadcrumb');
            let path = ['📝 Notes'];
            
            if (folderId) {
                const folderPath = [];
                let currentFolder = folders.find(f => f.id === folderId);
                
                while (currentFolder) {
                    folderPath.unshift(currentFolder.name);
                    currentFolder = folders.find(f => f.id === currentFolder.parentId);
                }
                
                path = path.concat(folderPath);
            }
            
            breadcrumb.textContent = path.join(' / ');
        }

        function showWelcomeScreen() {
            document.getElementById('welcomeScreen').style.display = 'flex';
            document.getElementById('editorPanel').style.display = 'none';
            currentNoteId = null;
            renderContent();
        }

        function updateNoteTitle() {
            if (!currentNoteId) return;
            
            const note = notes.find(n => n.id === currentNoteId);
            if (!note) return;
            
            const newTitle = document.getElementById('noteTitle').value || 'Untitled Note';
            note.title = newTitle;
            note.lastModified = new Date().toISOString();
            
            saveData();
            renderContent();
        }

        function updateNoteContent() {
            if (!currentNoteId) return;
            
            const note = notes.find(n => n.id === currentNoteId);
            if (!note) return;
            
            const content = document.getElementById('noteEditor').innerHTML;
            note.content = content;
            note.preview = document.getElementById('noteEditor').innerText.substring(0, 100) + '...';
            note.lastModified = new Date().toISOString();
            
            saveData();
            renderContent();
        }

        function deleteCurrentNote() {
            if (!currentNoteId) return;
            deleteNote(currentNoteId);
        }

        function formatText(command) {
            document.execCommand(command, false, null);
            document.getElementById('noteEditor').focus();
        }

        function insertList(type) {
            if (type === 'ul') {
                document.execCommand('insertUnorderedList', false, null);
            } else {
                document.execCommand('insertOrderedList', false, null);
            }
            document.getElementById('noteEditor').focus();
        }

        function changeFont(direction) {
            if (direction === 'larger') {
                document.execCommand('fontSize', false, '4');
            } else {
                document.execCommand('fontSize', false, '2');
            }
            document.getElementById('noteEditor').focus();
        }

        function searchContent(query) {
            const contentArea = document.getElementById('contentArea');
            const allItems = contentArea.querySelectorAll('.folder, .note-item');
            
            if (!query.trim()) {
                allItems.forEach(item => item.style.display = 'block');
                return;
            }
            
            const searchTerm = query.toLowerCase();
            
            allItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                    // Expand parent folders if needed
                    let parent = item.closest('.folder-content');
                    while (parent) {
                        parent.classList.add('expanded');
                        const toggle = parent.previousElementSibling?.querySelector('.folder-toggle');
                        if (toggle) toggle.classList.add('expanded');
                        parent = parent.parentElement.closest('.folder-content');
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        }

        function handleEditorKeydown(event) {
            // Add keyboard shortcuts
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'b':
                        event.preventDefault();
                        formatText('bold');
                        break;
                    case 'i':
                        event.preventDefault();
                        formatText('italic');
                        break;
                    case 'u':
                        event.preventDefault();
                        formatText('underline');
                        break;
                    case 'n':
                        event.preventDefault();
                        showCreateModal('note');
                        break;
                }
            }
        }

        function saveAll() {
            saveData();
            // Show a brief confirmation
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Saved!';
            btn.style.background = '#27ae60';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1500);
        }

        function exportNotes() {
            const exportData = {
                folders: folders,
                notes: notes,
                exportDate: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'notesflow-export.json';
            link.click();
            URL.revokeObjectURL(url);
        }

        // Auto-save every 30 seconds
        setInterval(saveData, 30000);

        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && !sidebarCollapsed) {
                const sidebar = document.getElementById('sidebar');
                const hamburger = document.querySelector('.hamburger');
                
                if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                    toggleSidebar();
                }
            }
        });