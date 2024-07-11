import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmTripModal from './ConfirmTripModal';
import { InviteGuestsModal } from './InviteGuestsModal';
import { DestinationAndDate } from './steps/destination-and-date';
import { InviteGuestsStep } from './steps/invite-guests-steps';
import { DateRange } from 'react-day-picker';
import { api } from '../../lib/axios';

export function CreateTripPage() {
  const navigate = useNavigate()
  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [IsConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);
  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventPeriod, setEventPeriod] = useState<DateRange | undefined>()

  const [emailsToInvite, setEmailsToInvite] = useState([
    'the2kiradev@gmail.com'
  ])

  function openGuestsInput() {
    setIsGuestsInputOpen(true);
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false);
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true);
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false);
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true);
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false);
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    setEmailsToInvite([
      ...emailsToInvite,
      email
    ])

    event.currentTarget.reset()
  }

  function removeEmailFromInvite(email: string) {
    setEmailsToInvite(emailsToInvite.filter(e => e !== email))
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!destination) {
      return
    }

    if (!eventPeriod?.from || !eventPeriod?.to) {
      return
    }

    if (emailsToInvite.length === 0) {
      return
    }

    if (!ownerName || !ownerEmail) {
      return
    }

    const response = await api.post('/trips', {
      destination,
      starts_at: eventPeriod.from,
      ends_at: eventPeriod.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    })
  
    const { tripId } = response.data

    navigate(`/trips/${tripId}`)
  }
  
  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className='flex flex-col items-center gap-3'>
          <img src="/logo.svg" alt="alt planner" />
          <p className="text-lg text-zinc-300">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>
        <div className='space-y-4'>
          <DestinationAndDate
            closeGuestsInput={closeGuestsInput}
            openGuestsInput={openGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            setDestination={setDestination}
            setEventPeriod={setEventPeriod}
            eventPeriod={eventPeriod}
          />


          {isGuestsInputOpen && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openGuestsModal={openGuestsModal}
              openConfirmTripModal={openConfirmTripModal}
            />
          )}
        </div>

        <p className="text-small text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
          com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.</p>
      </div>


      {isGuestsModalOpen && (
        <InviteGuestsModal
          closeGuestsModal={closeGuestsModal}
          addNewEmailToInvite={addNewEmailToInvite}
          emailsToInvite={emailsToInvite}
          removeEmailFromInvite={removeEmailFromInvite}
        />
      )}

      {IsConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
        />
      )}

    </div>
  );
}
