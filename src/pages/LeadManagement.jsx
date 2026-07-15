// Import React and hooks for state management
import React, { useState, useEffect } from 'react';

// Import toast notification system
import toast from 'react-hot-toast';

// Import Lucide icons
import { Plus, X, LayoutGrid, List } from 'lucide-react';

// Import theme hook
import { useTheme } from '../context/ThemeContext';

// Import lead components
import LeadForm from '../components/leads/LeadForm';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';

// Import common components
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

// Import context
import { useLeads } from '../context/LeadContext';


export default function LeadManagement() {

  const { isDarkMode } = useTheme();

  const {
    leads,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead,
    isLoading
  } = useLeads();


  // Fetch leads when page loads
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);


  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');

  const [activeFilter, setActiveFilter] = useState('All');


  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);


  // View mode
  const [viewMode, setViewMode] = useState('table');



  // Filter leads
  const filteredLeads = leads
    .filter(
      (lead) =>
        activeFilter === 'All' ||
        lead.status === activeFilter
    )
    .filter((lead) => {

      const query = searchQuery.toLowerCase();

      return (
        (lead.name || '')
          .toLowerCase()
          .includes(query) ||

        (lead.company || '')
          .toLowerCase()
          .includes(query) ||

        (lead.email || '')
          .toLowerCase()
          .includes(query)
      );
    });



  // Open create modal
  const openCreateModal = () => {

    setSelectedLead(null);

    setIsModalOpen(true);

  };



  // Open edit modal
  const openEditModal = (lead) => {

    setSelectedLead(lead);

    setIsModalOpen(true);

  };



  // Close modal
  const closeModal = () => {

    setIsModalOpen(false);

    setSelectedLead(null);

  };



  // Create / Update lead
  const handleFormSubmit = async (formData) => {

    try {

      if (selectedLead) {

        await updateLead(
          selectedLead._id,
          formData
        );

      } else {

        await addLead(formData);

      }


      await fetchLeads();

      closeModal();


    } catch (error) {

      console.error(
        "Lead save error:",
        error
      );

    }

  };



  // Clear filters
  const handleClearFilters = () => {

    setSearchQuery('');

    setActiveFilter('All');

  };



  // DELETE FIXED FUNCTION
  const handleDelete = async (id) => {

    try {

      console.log(
        "DELETE RECEIVED VALUE:",
        id
      );


      console.log(
        "DELETE VALUE TYPE:",
        typeof id
      );


      if (!id) {

        console.error(
          "❌ ID IS EMPTY"
        );

        return;

      }


      await deleteLead(id);


      await fetchLeads();


      toast.success(
        "Lead deleted successfully"
      );


    } catch (error) {


      console.error(
        "Delete failed:",
        error
      );


      toast.error(
        "Failed to delete lead"
      );

    }

  };  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 text-gray-900 dark:text-white sm:px-6 lg:px-8">

      <div className="w-full">


        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6 sm:flex-row sm:items-center">

          <div>

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Lead Management
            </h1>


            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Create, view, edit, and track active business leads inside your pipeline.
            </p>

          </div>



          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white"
          >

            <Plus className="h-4 w-4" />

            Add New Lead

          </button>


        </div>




        {/* SEARCH + VIEW */}
        <div className="mt-6 rounded-2xl border bg-white dark:bg-gray-800 p-4">


          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">


            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />



            <div className="flex gap-2">


              <button

                onClick={() => setViewMode('table')}

                className="rounded-lg border p-2"

              >

                <List className="h-4 w-4" />

              </button>



              <button

                onClick={() => setViewMode('card')}

                className="rounded-lg border p-2"

              >

                <LayoutGrid className="h-4 w-4" />

              </button>


            </div>


          </div>



          <div className="mt-4">

            <FilterBar

              activeFilter={activeFilter}

              onFilterChange={setActiveFilter}

              leads={leads}

            />

          </div>


        </div>





        {/* COUNT */}

        <div className="mt-4">

          Showing {filteredLeads.length} of {leads.length} leads

        </div>





        {/* LEADS DISPLAY */}

        <div className="mt-4">


          {viewMode === 'card' ? (


            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">


              {

                filteredLeads.length > 0 ?


                filteredLeads.map((lead) => (


                  <LeadCard

                    key={lead._id}

                    lead={lead}

                    onEdit={openEditModal}


                    // FIXED DELETE
                    onDelete={() => handleDelete(lead._id)}

                  />


                ))



                :


                <EmptyState

                  hasFilters={
                    searchQuery !== '' ||
                    activeFilter !== 'All'
                  }

                  onClearFilters={handleClearFilters}

                />


              }


            </div>



          ) : (


            filteredLeads.length > 0 ?


            <LeadTable

              leads={filteredLeads}

              onEdit={openEditModal}


              // FIXED DELETE
              onDelete={(id) => handleDelete(id)}

            />


            :


            <EmptyState

              hasFilters={
                searchQuery !== '' ||
                activeFilter !== 'All'
              }

              onClearFilters={handleClearFilters}

            />


          )}


        </div>



      </div>







      {/* MODAL */}


      {isModalOpen && (


        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">


          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6">


            <div className="flex justify-between">


              <h2 className="text-xl font-bold">

                {selectedLead
                  ? "Edit Lead"
                  : "Create New Lead"}

              </h2>



              <button

                onClick={closeModal}

              >

                <X className="h-5 w-5" />

              </button>


            </div>



            <div className="mt-5">


              <LeadForm

                initialData={selectedLead}

                onSubmit={handleFormSubmit}

                onCancel={closeModal}

              />


            </div>



          </div>


        </div>


      )}



    </div>

  );

}