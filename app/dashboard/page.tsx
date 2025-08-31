
import EmptyState from '@/components/ui/empty-state';
import { deleteProjectById, duplicateProjectById, editProjectById, getAllPlaygroundForUser } from '@/features/dashboard/actions';
import AddButton from '@/features/dashboard/components/Add-new-button'
import AddRepo from '@/features/dashboard/components/add-repo-button';
import ProjectTable from '@/features/dashboard/components/project-table';
import React from 'react'

const Page = async() => {

    const playgrounds= await getAllPlaygroundForUser()
  return (
    <div className='flex flex-col justify-start items-center min-h-screen mx-auto mx-w-7xl px-4 py-10'>
        <div className='grid grid-cols-2 md:grid-cols-2 gap-6 w-full'>
            <AddButton />
            <AddRepo/>

        </div>

        <div className='mt-10 flex flex-col justify-center items-center w-full'>
            {
                playgrounds && playgrounds.length ===0 ?(<EmptyState title='No Project found' description='Ceate a new Project to get started ' imageSrc='/empty.svg'/>):
                // todo add playground table
                <ProjectTable
                projects = {playgrounds || []}
                onDeleteProject={deleteProjectById}
                onUpdateProject={editProjectById}
                onDuplicateProject={duplicateProjectById}


                />
            }

        </div>
    </div>
  )
}

export default Page