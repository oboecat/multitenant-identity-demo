import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { InviteableGroup } from "./InviteUserForm";

const groupListItems: {[key in InviteableGroup]: string} = {
    resident: "Resident",
    owner: "Owner"
};

export function InviteableGroupDropdown({ selection, onSelect }: { 
    selection: InviteableGroup, 
    onSelect: (group: InviteableGroup) => void 
}) {
    const selectedGroup = selection;

    return (
        <div className="relative w-full block text-left">
            <Listbox 
                value={selectedGroup} 
                onChange={(group) => onSelect(group)}
                name="group"
            >
                <Listbox.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {groupListItems[selectedGroup]}
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Listbox.Options as="div" className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {Object.keys(groupListItems).map((group) => {
                                if (group === selectedGroup) {
                                    return null;
                                }
                                return (
                                    <Listbox.Option key={group} value={group} as={Fragment}>
                                        {({ active }) => (
                                            <div className={`${
                                                'block px-4 py-2 text-sm ' + (active ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700')
                                            }`}>
                                                {groupListItems[group as InviteableGroup]}
                                            </div>
                                        )
                                        }
                                    </Listbox.Option>
                                );
                            })}
                        </div>
                    </Listbox.Options>
                </Transition>
            </Listbox>
        </div>
    );
}