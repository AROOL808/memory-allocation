/**
 * Simulasi Manajemen Memori dengan algoritma First-Fit, Worst-Fit, dan Best-Fit
 * 
 * Keterangan:
 * - memory: Array berisi ukuran blok memori yang tersedia
 * - proc: Array berisi kebutuhan memori untuk setiap proses
 * - Jika blok memori lebih besar dari kebutuhan proses, blok akan dipecah
 */
function firstFit(memory, proc) {
    let blocks = [...memory];
    let allocation = Array(proc.length).fill(-1);
    let processesInfo = [];
    let blocksInfo = [];
    let pendingFragments = []; 

    // Inisialisasi blok awal (blok ke-0 sampai ke-4)
    for (let i = 0; i < blocks.length; i++) {
        blocksInfo.push({
            id: i,
            size: blocks[i],
            status: "Free"
        });
    }

    for (let i = 0; i < proc.length; i++) {
        for (let j = 0; j < blocks.length; j++) {
            if (blocks[j] >= proc[i] && blocksInfo[j].status === "Free") {
                allocation[i] = j;

                let originalSize = blocks[j];
                let fragmentSize = originalSize - proc[i];

                // Update blok utama dengan ukuran proses
                blocks[j] = proc[i];
                blocksInfo[j] = {
                    id: j,
                    size: proc[i],
                    status: "Allocated",
                    processId: i
                };

                // Simpan fragment ke antrian
                if (fragmentSize > 0) {
                    pendingFragments.push({
                        size: fragmentSize,
                        status: "Free"
                    });
                }

                processesInfo.push({
                    processId: i,
                    size: proc[i],
                    allocatedBlockId: j
                });

                break;
            }
        }

        if (allocation[i] === -1) {
            processesInfo.push({
                processId: i,
                size: proc[i],
                allocatedBlockId: -1,
                status: "Not Allocated"
            });
        }
    }

    // Setelah alokasi selesai, tambahkan fragment setelah blok ke-4
    let insertIndex = 5; // setelah blok ke-4 (indeks ke-4)
    for (let frag of pendingFragments) {
        blocks.splice(insertIndex, 0, frag.size);
        blocksInfo.splice(insertIndex, 0, {
            id: -1, 
            size: frag.size,
            status: "Free"
        });
        insertIndex++; 
    }

    // Reset ulang ID blok agar urut
    for (let i = 0; i < blocksInfo.length; i++) {
        blocksInfo[i].id = i;
    }

    return {
        algorithm: "First-Fit",
        allocation: allocation,
        blocks: blocksInfo,
        processes: processesInfo
    };
}

// Algoritma Best-Fit
function bestFit(memory, proc) {
    // Membuat salinan array memori agar tidak mengubah array asli
    let blocks = [...memory];
    let allocation = Array(proc.length).fill(-1);
    let processesInfo = [];
    let blocksInfo = [];
    
    // Mencatat informasi awal blok memori
    for (let i = 0; i < blocks.length; i++) {
        blocksInfo.push({
            id: i,
            size: blocks[i],
            status: "Free"
        });
    }
    
    // Tambahkan array untuk melacak blok yang telah dialokasikan
    let blockAllocated = Array(blocks.length).fill(false);
    
    // Alokasi untuk setiap proses
    for (let i = 0; i < proc.length; i++) {
        let bestIdx = -1;
        
        // Cari blok terkecil yang cukup untuk proses dan belum dialokasikan
        for (let j = 0; j < blocks.length; j++) {
            // Periksa apakah blok belum dialokasikan dan ukurannya cukup
            if (!blockAllocated[j] && blocks[j] >= proc[i]) {
                if (bestIdx === -1 || blocks[j] < blocks[bestIdx]) {
                    bestIdx = j;
                }
            }
        }
        
        // Jika ditemukan blok yang cocok
        if (bestIdx !== -1) {
            allocation[i] = bestIdx;
            // Tandai blok sebagai telah dialokasikan
            blockAllocated[bestIdx] = true;
            
            // Pecah blok jika ukurannya lebih besar dari kebutuhan proses
            let fragmentSize = blocks[bestIdx] - proc[i];
            if (fragmentSize > 0) {
                // Kurangi ukuran blok asli
                blocks[bestIdx] = proc[i];
                
                // Tambahkan blok baru untuk fragmen yang tersisa
                blocks.push(fragmentSize);
                blockAllocated.push(false); // Tambahkan status alokasi untuk blok baru
                blocksInfo.push({
                    id: blocksInfo.length,
                    size: fragmentSize,
                    status: "Free"
                });
            }
            
            // Update informasi blok
            blocksInfo[bestIdx] = {
                id: bestIdx,
                size: blocks[bestIdx],
                status: "Allocated",
                processId: i
            };
            
            // Tambahkan informasi proses
            processesInfo.push({
                processId: i,
                size: proc[i],
                allocatedBlockId: bestIdx,
                status: "Allocated"
            });
        } else {
            // Jika proses tidak dapat dialokasikan
            processesInfo.push({
                processId: i,
                size: proc[i],
                allocatedBlockId: -1,
                status: "Not Allocated"
            });
        }
    }
    
    return {
        algorithm: "Best-Fit",
        allocation: allocation,
        blocks: blocksInfo,
        processes: processesInfo
    };
}

function worstFit(memory, proc) {
    let blocks = [...memory];
    let allocation = Array(proc.length).fill(-1);
    let processesInfo = [];
    let blocksInfo = [];
    let pendingFragments = [];

    // Mencatat blok awal
    for (let i = 0; i < blocks.length; i++) {
        blocksInfo.push({
            id: i,
            size: blocks[i],
            status: "Free"
        });
    }

    for (let i = 0; i < proc.length; i++) {
        let worstIdx = -1;

        // Cari blok terbesar yang cukup
        for (let j = 0; j < blocks.length; j++) {
            if (blocks[j] >= proc[i] && blocksInfo[j].status === "Free") {
                if (worstIdx === -1 || blocks[j] > blocks[worstIdx]) {
                    worstIdx = j;
                }
            }
        }

        if (worstIdx !== -1) {
            allocation[i] = worstIdx;

            let fragmentSize = blocks[worstIdx] - proc[i];
            blocks[worstIdx] = proc[i];

            // Update blok yang dipakai
            blocksInfo[worstIdx] = {
                id: worstIdx,
                size: proc[i],
                status: "Allocated",
                processId: i
            };

            if (fragmentSize > 0) {
                pendingFragments.push({
                    size: fragmentSize,
                    status: "Free"
                });
            }

            processesInfo.push({
                processId: i,
                size: proc[i],
                allocatedBlockId: worstIdx
            });
        } else {
            processesInfo.push({
                processId: i,
                size: proc[i],
                allocatedBlockId: -1,
                status: "Not Allocated"
            });
        }
    }

    // Tambahkan fragment setelah blok awal
    let insertIndex = 5; 
    for (let frag of pendingFragments) {
        blocks.splice(insertIndex, 0, frag.size);
        blocksInfo.splice(insertIndex, 0, {
            id: -1, 
            size: frag.size,
            status: "Free"
        });
        insertIndex++;
    }

    // Update ulang ID blok agar berurutan
    for (let i = 0; i < blocksInfo.length; i++) {
        blocksInfo[i].id = i;
    }

    return {
        algorithm: "Worst-Fit",
        allocation: allocation,
        blocks: blocksInfo,
        processes: processesInfo
    };
}


function displayResult(result, containerId) {
    const container = document.getElementById(containerId);
    let html = '';
    
    // Ringkasan alokasi
    html += '<h3>Ringkasan Alokasi</h3>';
    html += '<table><thead><tr><th>Proses</th><th>Ukuran</th><th>Blok Dialokasikan</th><th>Status</th></tr></thead><tbody>';
    
    for (let i = 0; i < result.processes.length; i++) {
        const process = result.processes[i];
        const blockId = process.allocatedBlockId;
        const status = blockId === -1 ? 'Not Allocated' : 'Allocated';
        const rowClass = status === 'Allocated' ? 'status-allocated' : 'status-not-allocated';
        
        html += `<tr class="${rowClass}">
            <td>P${process.processId}</td>
            <td>${process.size}</td>
            <td>${blockId === -1 ? '-' : blockId}</td>
            <td>${status}</td>
        </tr>`;
    }
    
    html += '</tbody></table>';
    
    // Informasi blok memori
    html += '<h3>Status Blok Memori</h3>';
    html += '<table><thead><tr><th>Blok ID</th><th>Ukuran</th><th>Status</th><th>Proses</th></tr></thead><tbody>';
    
    for (let i = 0; i < result.blocks.length; i++) {
        const block = result.blocks[i];
        const rowClass = block.status === 'Allocated' ? 'status-allocated' : '';
        
        html += `<tr class="${rowClass}">
            <td>${block.id}</td>
            <td>${block.size}</td>
            <td>${block.status}</td>
            <td>${block.status === 'Allocated' ? 'P' + block.processId : '-'}</td>
        </tr>`;
    }
    
    html += '</tbody></table>';
    
    // Visualisasi memori
    html += '<h3>Visualisasi Memori</h3>';
    html += '<div class="memory-visualization">';
    
    for (let i = 0; i < result.blocks.length; i++) {
        const block = result.blocks[i];
        const blockClass = block.status === 'Allocated' ? 'allocated' : 'free';
        
        html += `<div class="memory-block ${blockClass}">
            <div><strong>Blok ${block.id}</strong></div>
            <div>Ukuran: ${block.size}</div>
            <div>${block.status === 'Allocated' ? 'P' + block.processId : 'Free'}</div>
        </div>`;
    }
    
    html += '</div>';
    
    container.innerHTML = html;
}

function runSimulation() {
    // Ambil nilai input
    const memoryInput = document.getElementById('memory').value;
    const processesInput = document.getElementById('processes').value;
    
    // Konversi input ke array
    const memory = memoryInput.split(',').map(item => parseInt(item.trim(), 10));
    const processes = processesInput.split(',').map(item => parseInt(item.trim(), 10));
    
    // Validasi input
    if (memory.some(isNaN) || processes.some(isNaN)) {
        alert('Input tidak valid. Pastikan semua nilai adalah angka yang dipisahkan koma.');
        return;
    }
    
    // Jalankan simulasi
    const firstFitResult = firstFit(memory, processes);
    const bestFitResult = bestFit(memory, processes);
    const worstFitResult = worstFit(memory, processes);
    
    // Tampilkan hasil
    displayResult(firstFitResult, 'firstFitResult');
    displayResult(bestFitResult, 'bestFitResult');
    displayResult(worstFitResult, 'worstFitResult');
}

function resetSimulation() {
    document.getElementById('memory').value = '';
    document.getElementById('processes').value = '';
    document.getElementById('firstFitResult').innerHTML = '';
    document.getElementById('bestFitResult').innerHTML = '';
    document.getElementById('worstFitResult').innerHTML = '';
}

function openTab(evt, tabName) {
    // Sembunyikan semua konten tab
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Hapus kelas "active" dari semua tab
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    // Tampilkan tab yang dipilih dan tandai sebagai aktif
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

