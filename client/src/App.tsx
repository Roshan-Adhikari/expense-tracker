import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppShell } from './components/layouts/AppShell'
import { Activity } from './pages/Activity'
import { AddExpense } from './pages/AddExpense'
import { Dashboard } from './pages/Dashboard'
import { ExpenseDetail } from './pages/ExpenseDetail'
import { FriendDetail } from './pages/FriendDetail'
import { Friends } from './pages/Friends'
import { GroupDetail } from './pages/GroupDetail'
import { Groups } from './pages/Groups'
import { Landing } from './pages/Landing'
import { AuthRecovery } from './pages/AuthRecovery'
import { ForgotPassword } from './pages/ForgotPassword'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { Profile } from './pages/Profile'
import { Settle } from './pages/Settle'
import { Signup } from './pages/Signup'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/recovery" element={<AuthRecovery />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<GroupDetail />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friends/:id" element={<FriendDetail />} />
        <Route path="/expenses/add" element={<AddExpense />} />
        <Route path="/expenses/:id" element={<ExpenseDetail />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settle/:id" element={<Settle />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
