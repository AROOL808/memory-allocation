    // Algoritma First-Fit
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
                        allocatedBlockId: j,
                        status: "Allocated"
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
        let insertIndex = blocks.length; // setelah blok terakhir
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

    // Algoritma Worst-Fit
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
                    allocatedBlockId: worstIdx,
                    status: "Allocated"
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
        let insertIndex = blocks.length; 
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

    function openTab(evt, tabName) {
        // Hide all tab content
        const tabContents = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove("active");
        }
        
        // Remove active class from all tabs
        const tabs = document.getElementsByClassName("tab");
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove("bg-indigo-600", "text-white");
            tabs[i].classList.add("text-gray-700");
        }
        
        // Show the specific tab content
        document.getElementById(tabName).classList.add("active");
        
        // Add active class to the button that opened the tab
        evt.currentTarget.classList.remove("text-gray-700");
        evt.currentTarget.classList.add("bg-indigo-600", "text-white");
    }

    function runSimulation() {
        // Parse input data
        const memoryInput = document.getElementById("memory").value;
        const processesInput = document.getElementById("processes").value;
        
        // Validate input
        if (!memoryInput || !processesInput) {
            alert("Mohon masukkan data blok memori dan kebutuhan proses!");
            return;
        }
        
        // Convert input to arrays
        const memory = memoryInput.split(",").map(x => parseInt(x.trim()));
        const processes = processesInput.split(",").map(x => parseInt(x.trim()));
        
        if (memory.some(isNaN) || processes.some(isNaN)) {
            alert("Input tidak valid! Pastikan semua nilai adalah angka.");
            return;
        }
        
        // Run algorithms
        const firstFitResult = firstFit(memory, processes);
        const bestFitResult = bestFit(memory, processes);
        const worstFitResult = worstFit(memory, processes);
        
        // Display results
        displayResult("firstFitResult", firstFitResult);
        displayResult("bestFitResult", bestFitResult);
        displayResult("worstFitResult", worstFitResult);
    }
    
    function displayResult(elementId, result) {
        const element = document.getElementById(elementId);
        
        let html = '';
        
        // Visualize memory blocks
        html += `<div class="mb-6">
                    <h3 class="font-medium text-gray-700 mb-2">Status Blok Memori:</h3>
                    <div class="flex flex-wrap gap-2 mb-4">`;
        
        result.blocks.forEach(block => {
            const colorClass = block.status === "Allocated" 
                ? "bg-indigo-100 border-indigo-300" 
                : "bg-green-100 border-green-300";
            const statusClass = block.status === "Allocated" 
                ? "bg-indigo-500" 
                : "bg-green-500";
            
            html += `<div class="memory-block p-3 rounded-md ${colorClass} border flex flex-col items-center">
                        <span class="text-sm font-medium">Blok ${block.id}</span>
                        <span class="text-lg font-bold">${block.size} KB</span>
                        <span class="text-xs px-2 py-1 rounded-full ${statusClass} text-white mt-1">${block.status}</span>
                        ${block.status === "Allocated" ? `<span class="text-xs mt-1">Proses ${block.processId}</span>` : ''}
                    </div>`;
        });
        
        html += `</div></div>`;
        
        // Visualize processes
        html += `<div class="mb-6">
                    <h3 class="font-medium text-gray-700 mb-2">Status Proses:</h3>
                    <div class="flex flex-wrap gap-2 mb-4">`;
        
        result.processes.forEach(process => {
            const allocated = process.allocatedBlockId !== -1;
            const colorClass = allocated 
                ? "bg-indigo-100 border-indigo-300" 
                : "bg-red-100 border-red-300";
            const statusClass = allocated 
                ? "bg-indigo-500" 
                : "bg-red-500";
            const status = allocated ? "Teralokasi" : "Menunggu";
            
            html += `<div class="memory-block p-3 rounded-md ${colorClass} border flex flex-col items-center">
                        <span class="text-sm font-medium">Proses ${process.processId}</span>
                        <span class="text-lg font-bold">${process.size} KB</span>
                        <span class="text-xs px-2 py-1 rounded-full ${statusClass} text-white mt-1">${status}</span>
                        ${allocated ? `<span class="text-xs mt-1">Blok ${process.allocatedBlockId}</span>` : ''}
                    </div>`;
        });
        
        html += `</div></div>`;
        
        // Table with allocation details
        html += `<div>
                    <h3 class="font-medium text-gray-700 mb-2">Hasil Alokasi ${result.algorithm}:</h3>
                    <div class="bg-white border border-gray-200 rounded-md p-3 overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b">
                                    <th class="py-2 text-left">Proses</th>
                                    <th class="py-2 text-left">Ukuran</th>
                                    <th class="py-2 text-left">Blok Memori</th>
                                    <th class="py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>`;
        
        result.processes.forEach(process => {
            const allocated = process.allocatedBlockId !== -1;
            const statusClass = allocated ? "text-green-600" : "text-red-600";
            const status = allocated ? "Teralokasi" : "Tidak Teralokasi";
            
            html += `<tr class="border-b">
                        <td class="py-2">Proses ${process.processId}</td>
                        <td class="py-2">${process.size} KB</td>
                        <td class="py-2">${allocated ? `Blok ${process.allocatedBlockId}` : "-"}</td>
                        <td class="py-2"><span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${status}</span></td>
                    </tr>`;
        });
        
        html += `</tbody></table></div>
                
                <div class="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div class="text-sm text-gray-600">
                        <p><span class="font-medium">Jumlah blok memori:</span> ${result.blocks.length}</p>
                        <p><span class="font-medium">Blok free:</span> ${result.blocks.filter(b => b.status === "Free").length}</p>
                        <p><span class="font-medium">Proses teralokasi:</span> ${result.processes.filter(p => p.allocatedBlockId !== -1).length} dari ${result.processes.length}</p>
                    </div>
                </div>
                </div>`;
        
        element.innerHTML = html;
    }
    
    function resetSimulation() {
        document.getElementById("memory").value = "";
        document.getElementById("processes").value = "";
        
        // Reset result displays
        document.getElementById("firstFitResult").innerHTML = '<div class="text-gray-500 text-center py-8">Hasil simulasi akan ditampilkan di sini...</div>';
        document.getElementById("bestFitResult").innerHTML = '<div class="text-gray-500 text-center py-8">Hasil simulasi akan ditampilkan di sini...</div>';
        document.getElementById("worstFitResult").innerHTML = '<div class="text-gray-500 text-center py-8">Hasil simulasi akan ditampilkan di sini...</div>';
    }