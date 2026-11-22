
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { formatMedium } from "@/lib/date";

export default function SettingsPage() {
  const router = useRouter();

  const { data, user, updateProfile, clearData, logout } = useAuth();

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Additional preferences
  const [reminderDays, setReminderDays] = useState("3");
  const [theme, setTheme] = useState("pink");
  const [weekStart, setWeekStart] = useState("Monday");

  // Load saved preferences
  useEffect(() => {
    setReminderDays(localStorage.getItem("reminderDays") || "3");
    setTheme(localStorage.getItem("theme") || "pink");
    setWeekStart(localStorage.getItem("weekStart") || "Monday");
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("reminderDays", reminderDays);
    localStorage.setItem("theme", theme);
    localStorage.setItem("weekStart", weekStart);
  }, [reminderDays, theme, weekStart]);

  if (!data || !user) return null;

  // Export user data
  function exportData() {
    const fileData = {
      exportedAt: new Date().toISOString(),
      profile: data.profile,
      logs: data.logs,
    };

    const file = new Blob(
      [JSON.stringify(fileData, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "lunara-data.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  // Sign out
  function signOut() {
    logout();
    router.replace("/");
  }

  // Delete cycle data
  function deleteData() {
    clearData();
    setConfirmDelete(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* PAGE HEADING */}
      <div>
        <p className="eyebrow">SETTINGS</p>

        <h1 className="mt-2 text-3xl sm:text-4xl">
          Your details
        </h1>

        <p className="mt-2 text-sm text-plum-500">
          Manage your profile, preferences and personal information.
        </p>
      </div>


      {/* PROFILE SETTINGS */}
      <section className="card">

        <h2 className="text-lg font-semibold">
          Profile
        </h2>

        <div className="mt-5 space-y-5">

          <div>
            <label className="label">
              Your Name
            </label>

            <input
              type="text"
              className="field"
              value={data.profile.name}
              onChange={(e) =>
                updateProfile({ name: e.target.value })
              }
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="label">
              Average Cycle Length
            </label>

            <select
              className="field"
              value={data.profile.cycleLength}
              onChange={(e) =>
                updateProfile({
                  cycleLength: Number(e.target.value),
                })
              }
            >
              {Array.from({ length: 25 }, (_, i) => i + 21).map(
                (days) => (
                  <option key={days} value={days}>
                    {days} days
                  </option>
                )
              )}
            </select>

            <p className="mt-2 text-xs text-plum-300">
              Your average menstrual cycle length.
            </p>
          </div>

          <div>
            <label className="label">
              Period Duration
            </label>

            <select
              className="field"
              value={data.profile.periodLength}
              onChange={(e) =>
                updateProfile({
                  periodLength: Number(e.target.value),
                })
              }
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                (days) => (
                  <option key={days} value={days}>
                    {days} days
                  </option>
                )
              )}
            </select>

            <p className="mt-2 text-xs text-plum-300">
              How long your period usually lasts.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-blush-100 bg-blush-50 p-5">

            <input
              type="checkbox"
              checked={data.profile.reminders}
              onChange={(e) =>
                updateProfile({
                  reminders: e.target.checked,
                })
              }
              className="mt-1 h-5 w-5 accent-pink-500"
            />

            <span>
              <span className="block text-sm font-semibold text-plum-900">
                Enable Period Reminders
              </span>

              <span className="mt-1 block text-xs text-plum-500">
                Show upcoming period reminders on your dashboard.
              </span>
            </span>

          </label>

        </div>
      </section>


      {/* REMINDER PREFERENCES */}
      <section className="card">

        <h2 className="text-lg font-semibold">
          Reminder Preferences
        </h2>

        <p className="mt-2 text-sm text-plum-500">
          Choose when you want to be reminded about your upcoming period.
        </p>

        <div className="mt-5">

          <label className="label">
            Remind me before my predicted period
          </label>

          <select
            className="field"
            value={reminderDays}
            onChange={(e) => setReminderDays(e.target.value)}
          >
            <option value="1">1 day before</option>
            <option value="2">2 days before</option>
            <option value="3">3 days before</option>
            <option value="5">5 days before</option>
            <option value="7">7 days before</option>
          </select>

        </div>

        <p className="mt-3 text-xs text-plum-300">
          Your reminder preference is saved automatically.
        </p>

      </section>


      {/* APPEARANCE SETTINGS */}
      <section className="card">

        <h2 className="text-lg font-semibold">
          Appearance
        </h2>

        <p className="mt-2 text-sm text-plum-500">
          Personalize the look of your Lunara application.
        </p>

        <div className="mt-5">

          <label className="label">
            Choose your theme
          </label>

          <div className="mt-3 grid grid-cols-2 gap-4">

            <button
              type="button"
              onClick={() => setTheme("pink")}
              className={`rounded-2xl border-2 p-4 text-left ${
                theme === "pink"
                  ? "border-blush-500 bg-blush-50"
                  : "border-blush-100"
              }`}
            >
              <div className="mb-3 h-9 rounded-lg bg-pink-200" />

              <p className="text-sm font-semibold text-plum-900">
                Soft Pink
              </p>

              <p className="mt-1 text-xs text-plum-400">
                Classic Lunara theme
              </p>
            </button>

            <button
              type="button"
              onClick={() => setTheme("lavender")}
              className={`rounded-2xl border-2 p-4 text-left ${
                theme === "lavender"
                  ? "border-purple-400 bg-purple-50"
                  : "border-blush-100"
              }`}
            >
              <div className="mb-3 h-9 rounded-lg bg-purple-200" />

              <p className="text-sm font-semibold text-plum-900">
                Lavender
              </p>

              <p className="mt-1 text-xs text-plum-400">
                Calm purple theme
              </p>
            </button>

          </div>

        </div>

        <p className="mt-3 text-xs text-plum-300">
          Theme selection is saved locally. Connect it to your
          application-wide styles to apply it everywhere.
        </p>

      </section>


      {/* CALENDAR PREFERENCES */}
      <section className="card">

        <h2 className="text-lg font-semibold">
          Calendar Preferences
        </h2>

        <p className="mt-2 text-sm text-plum-500">
          Customize your calendar display.
        </p>

        <div className="mt-5">

          <label className="label">
            First Day of the Week
          </label>

          <select
            className="field"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          >
            <option value="Monday">Monday</option>
            <option value="Sunday">Sunday</option>
          </select>

        </div>

        <p className="mt-3 text-xs text-plum-300">
          Your calendar preference is saved automatically.
          Connect it to CalendarView to change the calendar layout.
        </p>

      </section>


      {/* PRIVACY SETTINGS */}
      <section className="card">

        <h2 className="text-lg font-semibold">
          Privacy & Data
        </h2>

        <p className="mt-2 text-sm text-plum-500">
          Manage and understand your personal information.
        </p>

        <div className="mt-5 space-y-4">

          <div className="rounded-2xl bg-blush-50 p-4">
            <h3 className="text-sm font-semibold text-plum-900">
              Data Storage
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-plum-500">
              Your cycle information is stored in your browser's
              local storage in this version of Lunara.
            </p>
          </div>

          <div className="rounded-2xl bg-blush-50 p-4">
            <h3 className="text-sm font-semibold text-plum-900">
              Data Backup
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-plum-500">
              Export your cycle records regularly to keep a backup.
            </p>

            <button
              onClick={exportData}
              className="btn-secondary mt-3"
            >
              Download My Data
            </button>
          </div>

          <div className="rounded-2xl bg-blush-50 p-4">
            <h3 className="text-sm font-semibold text-plum-900">
              Personal Information
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-plum-500">
              Avoid sharing your personal cycle records with
              unauthorized people.
            </p>
          </div>

        </div>

      </section>


      {/* ACCOUNT INFORMATION */}
      <section className="card">

        <h2 className="text-lg font-semibold">
          Account Information
        </h2>

        <div className="mt-5 space-y-4 text-sm">

          <div className="flex justify-between gap-3">
            <span className="text-plum-500">Email</span>
            <span className="font-medium text-plum-900">
              {user.email}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-plum-500">Member Since</span>
            <span className="font-medium text-plum-900">
              {formatMedium(new Date(user.createdAt))}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-plum-500">Days Logged</span>
            <span className="font-medium text-plum-900">
              {Object.keys(data.logs).length}
            </span>
          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          <button
            onClick={exportData}
            className="btn-secondary"
          >
            Export Data (JSON)
          </button>

          <button
            onClick={signOut}
            className="btn-ghost"
          >
            Sign Out
          </button>

        </div>

      </section>


      {/* DANGER ZONE */}
      <section className="card border-blush-200 bg-blush-50">

        <h2 className="text-lg font-semibold">
          Danger Zone
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-plum-500">
          Clearing your data deletes all logged period days and
          cycle records. This action cannot be undone.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">

          {!confirmDelete ? (

            <button
              onClick={() => setConfirmDelete(true)}
              className="btn-secondary"
            >
              Clear All Cycle Data
            </button>

          ) : (

            <>
              <button
                onClick={deleteData}
                className="btn bg-blush-700 text-white"
              >
                Yes, Delete Everything
              </button>

              <button
                onClick={() => setConfirmDelete(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
            </>

          )}

        </div>

      </section>


      {/* ABOUT LUNARA */}
      <section className="card">

        <h2 className="text-lg font-semibold">
          About Lunara
        </h2>

        <div className="mt-5 space-y-4 text-sm">

          <div className="flex justify-between">
            <span className="text-plum-500">Application</span>
            <span className="font-semibold text-plum-900">
              Lunara
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-plum-500">Version</span>
            <span className="font-semibold text-plum-900">
              1.0.0
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-plum-500">Platform</span>
            <span className="font-semibold text-plum-900">
              Web Application
            </span>
          </div>

        </div>

        <div className="mt-5 rounded-2xl bg-blush-50 p-5">

          <h3 className="text-sm font-semibold text-plum-900">
            Made with care 💗
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-plum-500">
            Lunara helps you understand your menstrual cycle,
            record symptoms and keep track of your wellness.
            Cycle predictions are estimates and should not be
            used as contraception or medical diagnosis.
          </p>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="pb-5 text-center text-xs text-plum-300">
        Made with love for your wellness 🌸
        <p className="mt-2">
          Lunara © 2026
        </p>
      </footer>

    </div>
  );
}
