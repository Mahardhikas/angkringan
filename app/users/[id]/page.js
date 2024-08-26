'use client'
import { useEffect, useState } from "react";
import UserForm from "../../components/layout/UserForm";
import UserTabs from "../../components/layout/UserTabs";
import { useProfile } from "../../components/UseProfile";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditUserPage() {
    const {loading, data} = useProfile();
    const [user, setUser] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        fetch('/api/profile?_id='+id).then(res => {
            res.json().then(user => {
                setUser(user);
            });
        })
    }, []);

    async function handleSaveButtonClick(ev, data) { 
        ev.preventDefault();
        const promise = new Promise (async (resolve, reject) => {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'applicaton/json'},
                body: JSON.stringify({...data,_id:id}),
            })
            if (res.ok)
                resolve();
            else 
            reject();
        });

        await toast.promise(promise, {
            loading: 'Saving user...',
            success: 'User saved',
            error: 'An error has occured while saying the user',
        })
    }

    if (loading) {
        return 'Loading user profile...'
    }

    if (!data.owner) {
        return 'Not an owner'
    }

    return(
        <section className="mt-8">
            <UserTabs isOwner={true}/>
            <div className="max-w-2xl mx-auto mt-8">
                <UserForm user={user} onSave={handleSaveButtonClick} />
            </div>
        </section>
    )
}