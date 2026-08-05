export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <section className="py-20 bg-slate-50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl prose dark:prose-invert">
          <h2>1. Terms</h2>
          <p>
            By accessing this Website, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on FutureBridge Technologies' Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose or for any public display;</li>
            <li>attempt to reverse engineer any software contained on FutureBridge Technologies' Website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>
            All the materials on FutureBridge Technologies' Website are provided "as is". FutureBridge Technologies makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, FutureBridge Technologies does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
          </p>

          <h2>4. Limitations</h2>
          <p>
            FutureBridge Technologies or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on FutureBridge Technologies' Website, even if FutureBridge Technologies or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.
          </p>
        </div>
      </section>
    </div>
  );
}
