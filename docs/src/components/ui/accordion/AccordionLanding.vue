<template>
    <Accordion type="single" collapsible>
      <AccordionItem value="features">
        <AccordionTrigger>Fonctionnalités principales</AccordionTrigger>
        <AccordionContent>
          <ul class="list-disc pl-6 space-y-1">
            <li>Catalogue communautaire d'agents, workflows et outils Mastra prêts à l'emploi</li>
            <li>CLI simple pour lister, importer et configurer des agents dans votre projet</li>
            <li>Personnalisation totale : les agents sont copiés dans votre code, modifiables à volonté</li>
            <li>registry.json généré automatiquement</li>
            <li>Extensible : tout le monde peut proposer de nouveaux agents via PR</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="usage">
        <AccordionTrigger>Utilisation rapide</AccordionTrigger>
        <AccordionContent>
          <ul class="list-disc pl-6 space-y-1">
            <li><code>npx tsai-registry list</code> — Lister les agents disponibles</li>
            <li><code>npx tsai-registry add &lt;agent-name&gt;</code> — Ajouter un agent à votre projet</li>
            <li><code>npx tsai-registry settings</code> — Afficher la configuration</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="contrib">
        <AccordionTrigger>Contribuer</AccordionTrigger>
        <AccordionContent>
          <ul class="list-disc pl-6 space-y-1">
            <li>Forkez le repo, ajoutez vos agents, ouvrez une Pull Request !</li>
            <li>Documentez chaque agent (README, exemples, dépendances, variables d'environnement)</li>
            <li>Inspirez-vous de l'écosystème Python et de shadcn/ui pour la philosophie "open, modulaire, personnalisable"</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </template>
  
  <script setup lang="ts">
  import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./index";
  </script>
  