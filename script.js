let channels = [];

function addChannel() {
    const channelName = document.getElementById('channelName').value.trim();
    const iframeCount = parseInt(document.getElementById('iframeCount').value);
    const platform = document.getElementById('platform').value;

    if (!channelName || iframeCount < 1) {
        alert('Lütfen geçerli bilgiler girin!');
        return;
    }

    const channel = {
        id: Date.now(),
        name: channelName,
        count: iframeCount,
        platform: platform,
        status: 'offline',
        active: false
    };

    channels.push(channel);
    updateChannelList();
    document.getElementById('channelName').value = '';
}

function updateChannelList() {
    const channelList = document.getElementById('channelList');
    channelList.innerHTML = '<h2>Kanal Listesi</h2>';
    
    if (channels.length === 0) {
        channelList.innerHTML += '<p style="text-align:center; opacity:0.7;">Henüz kanal eklenmedi</p>';
        return;
    }
    
    channels.forEach(channel => {
        const channelElement = document.createElement('div');
        channelElement.className = 'channel-item';
        channelElement.innerHTML = `
            <div class="channel-info">
                <span>${channel.name} (${channel.count} iframe) - ${channel.platform}</span>
                <span class="status-badge ${channel.status === 'online' ? 'status-online' : 'status-offline'}">
                    ${channel.status}
                </span>
            </div>
            <div class="channel-actions">
                ${channel.active ? 
                    `<button class="btn btn-stop" onclick="stopChannel(${channel.id})">Durdur</button>` :
                    `<button class="btn btn-start" onclick="startChannel(${channel.id})">Başlat</button>`
                }
                <button class="btn btn-delete" onclick="deleteChannel(${channel.id})">Sil</button>
            </div>
        `;
        channelList.appendChild(channelElement);
    });
}

function startChannel(id) {
    const channel = channels.find(c => c.id === id);
    if (channel) {
        channel.active = true;
        channel.status = 'online';
        updateChannelList();
        createIframes(channel);
    }
}

function stopChannel(id) {
    const channel = channels.find(c => c.id === id);
    if (channel) {
        channel.active = false;
        channel.status = 'offline';
        updateChannelList();
        removeIframes(id);
    }
}

function deleteChannel(id) {
    channels = channels.filter(c => c.id !== id);
    updateChannelList();
    removeIframes(id);
}

function createIframes(channel) {
    const iframeGroups = document.getElementById('iframeGroups');
    const groupDiv = document.createElement('div');
    groupDiv.className = 'iframe-group';
    groupDiv.id = `iframe-group-${channel.id}`;
    
    let iframesHTML = '';
    const baseUrl = channel.platform === 'kick' 
        ? `https://player.kick.com/${channel.name}`
        : `https://player.twitch.tv/?channel=${channel.name}`;
    
    for (let i = 0; i < channel.count; i++) {
        iframesHTML += `<iframe src="${baseUrl}" allowfullscreen></iframe>`;
    }
    
    groupDiv.innerHTML = `
        <h3>${channel.name} - ${channel.platform}</h3>
        <div class="iframe-container">
            ${iframesHTML}
        </div>
    `;
    
    iframeGroups.appendChild(groupDiv);
}

function removeIframes(id) {
    const group = document.getElementById(`iframe-group-${id}`);
    if (group) group.remove();
}