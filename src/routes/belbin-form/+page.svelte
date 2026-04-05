<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    interface Employee {
        no: string;
        name: string;
    }

    let employees = $derived((data.dropdownOptions['Employee'] || []) as unknown as Employee[]);
    let empNoOptions = $derived(employees.map((e) => e.no).filter(Boolean));
    let empNameOptions = $derived(employees.map((e) => e.name).filter(Boolean));

    let empNo = $state('');
    let empName = $state('');
    let isSubmitting = $state(false);
    let errorMessage = $state('');
    let successMessage = $state('');
    
    let currentStep = $state(0);

    function onEmpNoChange() {
        if (empNo) {
            const emp = employees.find((e) => e.no === empNo);
            if (emp && empName !== emp.name) empName = emp.name;
        }
    }

    function onEmpNameChange() {
        if (empName) {
            const emp = employees.find((e) => e.name === empName);
            if (emp && empNo !== emp.no) empNo = emp.no;
        }
    }

    // Pre-initialize the 7 sections with 10 empty properties (a-j)
    // We use undefined initially, but they represent numbers when filled
    const initialSection = () => ({
        a: '', b: '', c: '', d: '', e: '',
        f: '', g: '', h: '', i: '', j: ''
    });

    let sections = $state([
        initialSection(), initialSection(), initialSection(), initialSection(),
        initialSection(), initialSection(), initialSection()
    ]);

    // Compute the sum of points for each section
    let sectionSums = $derived.by(() => {
        return sections.map(sec => {
            return Object.values(sec).reduce((acc: number, val) => acc + (Number(val) || 0), 0);
        });
    });

    // Valid if all sections sum exactly to 10
    let allSectionsValid = $derived.by(() => {
        return sectionSums.every(sum => sum === 10);
    });

    // Check if form is ready to submit
    let canSubmit = $derived(empNo.trim() !== '' && empName.trim() !== '' && allSectionsValid);

    let isNextDisabled = $derived.by(() => {
        if (currentStep === 0) return empNo.trim() === '' || empName.trim() === '';
        if (currentStep >= 1 && currentStep <= 7) return sectionSums[currentStep - 1] !== 10;
        return false;
    });

    function nextStep() {
        if (!isNextDisabled && currentStep < 7) {
            currentStep++;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function updateScore(sectionIndex: number, questionKey: string, delta: number) {
        const currentVal = Number((sections[sectionIndex] as any)[questionKey]) || 0;
        let newVal = currentVal + delta;
        if (newVal < 0) newVal = 0;
        
        const currentSum = sectionSums[sectionIndex];
        if (delta > 0 && currentSum >= 10) return;
        if (delta > 0 && currentSum + delta > 10) {
            newVal = currentVal + (10 - currentSum);
        }
        
        (sections[sectionIndex] as any)[questionKey] = newVal === 0 ? '' : newVal;
    }

    const BELBIN_SECTIONS = [
        {
            title: "Section 1: What I believe I can contribute to a team",
            questions: {
                a: "I think I can quickly see and take advantage of new opportunities.",
                b: "I can work well with a very wide range of people.",
                c: "I am good at getting people to agree on our goals and what we need to do.",
                d: "I can offer original ideas and imaginative solutions.",
                e: "I can analyze situations objectively without emotional bias.",
                f: "I am ready to face challenges and bring a lot of drive.",
                g: "I can turn ideas into practical actions reliably.",
                h: "I ensure that mistakes or omissions are caught and fixed.",
                i: "I provide specialized knowledge and technical expertise.",
                j: "I tend to stay quiet until I feel my opinion is absolutely needed."
            }
        },
        {
            title: "Section 2: If I have a possible shortcoming in teamwork, it could be that",
            questions: {
                a: "I am not at ease unless meetings are well structured and controlled.",
                b: "I am sometimes seen as taking too much credit for team efforts.",
                c: "I am prone to provocation and can easily offend people's feelings.",
                d: "I sometimes ignore incidentals and get too wrapped up in ideas to communicate effectively.",
                e: "I tend to lose interest in a project once the initial fascination has passed.",
                f: "I lack the ability to inspire and motivate others on my own.",
                g: "I am indecisive during crunch situations.",
                h: "I am reluctant to delegate and inclined to worry unduly.",
                i: "I dwell on technicalities and contribute on a very narrow front.",
                j: "I usually prefer to follow what others suggest without voicing my own concerns."
            }
        },
        {
            title: "Section 3: When involved in a project with other people",
            questions: {
                a: "I have an aptitude for influencing people without pressuring them.",
                b: "I am always ready to take the lead to make sure things move.",
                c: "I try to look at alternative approaches and think outside the box.",
                d: "I am quick to report back on what others are doing inside and outside the group.",
                e: "My capacity for analyzing details helps to keep the team on the right track.",
                f: "I try to prevent conflicts from developing and maintain morale.",
                g: "I try to establish a clear structure and plan.",
                h: "I focus heavily on making sure every detail is perfect.",
                i: "I focus mainly on my own area of expertise.",
                j: "I wait for instructions and follow them to the letter."
            }
        },
        {
            title: "Section 4: My characteristic approach to group work is that",
            questions: {
                a: "I am willing to challenge the views of others or hold a minority view myself.",
                b: "I can be relied upon to provide a new line of thought when the team is stuck.",
                c: "I am good at building external networks and gathering useful resources.",
                d: "I am capable of making an impartial judgment on any idea.",
                e: "I have a quiet interest in getting to know my colleagues better.",
                f: "I am willing to take on routine tasks that need doing.",
                g: "I can be relied upon to coordinate the team's efforts.",
                h: "I am constantly looking for errors and mistakes in our work.",
                i: "I am eager to apply my technical background to specific problems.",
                j: "I generally try to blend into the background."
            }
        },
        {
            title: "Section 5: I gain satisfaction in a job because",
            questions: {
                a: "I enjoy analyzing a situation and thinking up original approaches.",
                b: "I like making new contacts and exploring what they offer.",
                c: "I enjoy carefully evaluating options to find the correct decision.",
                d: "I like to foster good working relationships.",
                e: "I feel satisfied when things follow a clear, practical plan.",
                f: "I like being able to draw out the best in people.",
                g: "I enjoy having a strong influence on decisions.",
                h: "I love feeling that a job has been finished to the absolute highest standard.",
                i: "I enjoy acquiring deep knowledge in my chosen field.",
                j: "I prefer jobs where I don't have to carry heavy responsibility."
            }
        },
        {
            title: "Section 6: If I am suddenly given a difficult task with limited time and unfamiliar people",
            questions: {
                a: "I would carefully assess the situation before taking any action.",
                b: "I would focus on reducing the tension to get everyone working together.",
                c: "I would quickly map out a step-by-step practical plan.",
                d: "I would try to find out what everyone is good at and assign roles.",
                e: "I would take charge and forcefully push the group toward the goal.",
                f: "I would immediately start brainstorming outside-the-box solutions.",
                g: "I would search for shortcuts or external help to speed things up.",
                h: "I would obsess over avoiding critical mistakes despite the rush.",
                i: "I would tackle the part of the task that aligns with my specific skills.",
                j: "I would patiently wait to see what the others decide to do."
            }
        },
        {
            title: "Section 7: With reference to the problems I am subject to in working in groups",
            questions: {
                a: "I am apt to show my boredom or hold back when people disagree.",
                b: "I am slow to adapt when the plan changes unexpectedly.",
                c: "I tend to over-delegate and avoid getting my hands dirty.",
                d: "I am sometimes seen as too aggressive or demanding.",
                e: "I can struggle to communicate my complex ideas effectively.",
                f: "I often talk too much and lose focus.",
                g: "I can be overly critical and dampen the enthusiasm of others.",
                h: "I can be obsessive about small details and annoy others.",
                i: "I sometimes overlook the big picture while focusing on technicalities.",
                j: "I tend to agree with whatever the majority decides without much thought."
            }
        }
    ];

    const questions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

    async function handleSubmit() {
        if (!canSubmit) return;
        isSubmitting = true;
        errorMessage = '';
        
        try {
            // Convert string inputs to numbers
            const processedSections = sections.map(sec => {
                const numericSec: Record<string, number> = {};
                for (const [key, val] of Object.entries(sec)) {
                    numericSec[key] = Number(val) || 0;
                }
                return numericSec;
            });

            const res = await fetch('/api/belbin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    empNo,
                    empName,
                    sections: processedSections
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit the form');
            }

            successMessage = 'Form submitted successfully!';
            setTimeout(() => {
                goto('/admin/belbin');
            }, 2000);

        } catch (err: any) {
            errorMessage = err.message || 'An unexpected error occurred';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:head>
    <title>Belbin Team Roles</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10">
            <h1 class="text-3xl font-extrabold text-blue-900 tracking-tight sm:text-4xl">
                Belbin Self-Perception Inventory
            </h1>
            <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                For each of the 7 sections below, distribute exactly 10 points across the sentences that best describe your behavior. You can allocate all 10 to one sentence, or spread them out.
            </p>
        </div>

        <div class="bg-white shadow-xl rounded-2xl overflow-hidden mb-8 border border-gray-100">
            <!-- Progress Bar -->
            <div class="bg-gray-100 h-2 w-full">
                <div class="bg-blue-500 h-2 transition-all duration-300" style="width: {currentStep === 0 ? 5 : (currentStep / 7) * 100}%"></div>
            </div>

            {#if currentStep === 0}
            <div class="p-6 sm:p-8 bg-blue-50 border-b border-blue-100">
                <h3 class="text-xl font-bold text-blue-800 mb-4">Employee Information</h3>
                <div class="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                    <div>
                        <label for="empNo" class="block text-sm font-medium text-gray-700">Employee Number</label>
                        <div class="mt-2">
                            <select id="empNo" bind:value={empNo} onchange={onEmpNoChange}
                                class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                                <option value="" disabled selected>Select Emp No</option>
                                {#each empNoOptions as opt}
                                    <option value={opt}>{opt}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label for="empName" class="block text-sm font-medium text-gray-700">Employee Name</label>
                        <div class="mt-2">
                            <select id="empName" bind:value={empName} onchange={onEmpNameChange}
                                class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                                <option value="" disabled selected>Select Emp Name</option>
                                {#each empNameOptions as opt}
                                    <option value={opt}>{opt}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {:else if currentStep >= 1 && currentStep <= 7}
            {@const sectionIndex = currentStep - 1}
            {@const section = sections[sectionIndex]}
            <div class="p-6 sm:p-8 space-y-12">
                <div class="relative bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-200 {sectionSums[sectionIndex] === 10 ? 'ring-2 ring-green-400 border-transparent' : sectionSums[sectionIndex] > 10 ? 'ring-2 ring-red-400 border-transparent' : ''}">
                    
                    <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <h3 class="text-xl font-bold text-gray-900">{BELBIN_SECTIONS[sectionIndex].title}</h3>
                        <div class="flex items-center gap-3">
                            <span class="text-sm font-medium text-gray-500 hidden sm:inline">Points allocated:</span>
                            <span class="inline-flex items-center justify-center h-8 px-3 rounded-full text-sm font-bold {sectionSums[sectionIndex] === 10 ? 'bg-green-100 text-green-700' : sectionSums[sectionIndex] > 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">
                                {sectionSums[sectionIndex]} / 10
                            </span>
                        </div>
                    </div>

                    <div class="space-y-4">
                        {#each questions as q}
                            <div class="flex items-center gap-4 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div class="flex-shrink-0 flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                                    <button 
                                        type="button" 
                                        class="w-8 h-8 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-lg shadow-sm"
                                        disabled={Number((section as any)[q] || 0) <= 0}
                                        onclick={() => updateScore(sectionIndex, q, -1)}
                                    >-</button>
                                    <input type="number" min="0" max="10" bind:value={(section as any)[q]}
                                        class="block w-12 border-0 bg-transparent py-1 px-1 text-gray-900 focus:ring-0 sm:text-sm text-center font-bold" 
                                        placeholder="0">
                                    <button 
                                        type="button" 
                                        class="w-8 h-8 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-lg shadow-sm"
                                        disabled={sectionSums[sectionIndex] >= 10 || Number((section as any)[q] || 0) >= 10}
                                        onclick={() => updateScore(sectionIndex, q, 1)}
                                    >+</button>
                                </div>
                                <div class="flex-1 text-gray-700 group-hover:text-gray-900 border-l border-gray-200 pl-4">
                                    <span class="font-bold text-gray-400 mr-2 uppercase">{q}.</span> 
                                    {(BELBIN_SECTIONS[sectionIndex].questions as any)[q]}
                                </div>
                            </div>
                        {/each}
                    </div>

                    {#if sectionSums[sectionIndex] > 10}
                        <p class="mt-4 text-sm text-red-600 font-medium">You have allocated more than 10 points. Please reduce some scores.</p>
                    {:else if sectionSums[sectionIndex] < 10}
                        <p class="mt-4 text-sm text-blue-600 font-medium">{10 - sectionSums[sectionIndex]} points remaining to be allocated for this section.</p>
                    {/if}
                </div>
            </div>
            {/if}

            {#if errorMessage}
                <div class="px-6 sm:px-8 py-4 bg-red-50 border-t border-red-200 text-red-700 text-sm font-medium text-center">
                    {errorMessage}
                </div>
            {/if}

            {#if successMessage}
                <div class="px-6 sm:px-8 py-4 bg-green-50 border-t border-green-200 text-green-700 text-sm font-medium text-center">
                    {successMessage}
                </div>
            {/if}

            <div class="p-6 sm:p-8 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div>
                    <button 
                        type="button" 
                        onclick={prevStep} 
                        disabled={currentStep === 0 || isSubmitting}
                        class="inline-flex justify-center items-center rounded-xl bg-white border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all {currentStep === 0 ? 'invisible' : ''}"
                    >
                        Previous
                    </button>
                </div>
                <div>
                    {#if currentStep < 7}
                        <button 
                            type="button" 
                            onclick={nextStep} 
                            disabled={isNextDisabled || isSubmitting}
                            class="inline-flex justify-center items-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    {:else}
                        <button 
                            type="button" 
                            onclick={handleSubmit} 
                            disabled={!canSubmit || isSubmitting}
                            class="inline-flex justify-center items-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed transition-all"
                        >
                            {#if isSubmitting}
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            {:else}
                                Submit
                            {/if}
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
